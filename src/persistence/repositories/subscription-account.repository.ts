import { GetSubscriptionAccountParams } from '@application/subscription-account/dtos/args/get-subscription-account.args'
import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception'
import { Prisma, SubscriptionAccount } from '@prisma/client'
import { CreateSubscriptionAccountInput } from '../../application/subscription-account/dtos/inputs/create-subscription-account.input'
import { SubscriptionWithPlatform } from '../../application/subscription-account/types/subscription-account.types'
import { PrismaErrorsEnum } from '../../utils/prisma-errors'
import { PrismaService } from '../services/prisma.service'
import { PlatformRepository } from './platform.repository'
import { plainToInstance } from 'class-transformer'
import {
  IPaginatedSubscriptionAccountModel,
  SubscriptionAccountModel,
} from '../../application/subscription-account/dtos/models/subscription-account.model'
import { IEdgeType } from '../../utils/pagination/cursor-pagination'

@Injectable()
export class SubscriptionAccountRepository {
  constructor(private readonly prisma: PrismaService, private readonly platformRepo: PlatformRepository) {}

  async createSubscriptionAccount(
    { email, password, platformUUID, completePrice, isSoldBySlots, slotPrice, slots }: CreateSubscriptionAccountInput,
    userId: number,
  ) {
    try {
      const platform = await this.platformRepo.getPlatformByUUID(platformUUID)
      if (!platform) {
        throw new NotFoundException(`platform ${platformUUID} not found`)
      }

      const transactionResponse = await this.prisma.$transaction(async (prisma) => {
        await this.platformRepo.assignPlatform(platform.id, userId)

        const subscriptionAccount = await prisma.subscriptionAccount.create({
          data: {
            email,
            password,
            completePrice,
            isSoldBySlots,
            slots,
            slotPrice,
            availableSlots: slots,
            platform: {
              connect: { uuid: platformUUID },
            },
          },
          include: { platform: true },
        })

        return subscriptionAccount
      })

      return transactionResponse
    } catch (error) {
      const platform = await this.prisma.platform.findUnique({
        where: { uuid: platformUUID },
        rejectOnNotFound: false,
      })
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaErrorsEnum.P2002) {
        throw new BadRequestException(
          'there are already' + `${platform ? ' a ' + platform.name : ' an'}` + ' account with this email:' + email,
        )
      }

      throw new UnprocessableEntityException(error)
    }
  }

  async getSubscriptionAccounstByPlatform(platformUUID: string): Promise<SubscriptionWithPlatform[]> {
    return this.prisma.subscriptionAccount.findMany({
      where: {
        platform: {
          uuid: platformUUID,
        },
      },
      include: { platform: true },
    })
  }

  async findByUUID(uuid: string): Promise<SubscriptionAccount> {
    return this.prisma.subscriptionAccount.findUnique({
      where: {
        uuid,
      },
    })
  }

  async findByName(
    { take, after, name }: GetSubscriptionAccountParams,
    userId: number,
  ): Promise<IPaginatedSubscriptionAccountModel> {
    const where: Prisma.SubscriptionAccountWhereInput = {
      isActive: true,
      platform: {
        managers: {
          some: {
            userId,
          },
        },
      },
      ...(name && {
        OR: [
          {
            email: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            platform: {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          },
        ],
      }),
    }
    const totalCount = await this.prisma.subscriptionAccount.count({ where })

    const suscriptionAccounts = await this.prisma.subscriptionAccount.findMany({
      where,
      take: typeof take === 'number' ? take + 1 : undefined,
      skip: after ? 1 : undefined,
      cursor: after ? { uuid: after } : undefined,
      orderBy: [{ createdAt: 'desc' }],
      include: { platform: true },
    })

    const results = suscriptionAccounts.map(({ slotPrice, completePrice, ...account }) =>
      plainToInstance(SubscriptionAccountModel, {
        ...account,
        slotPrice: slotPrice.toNumber(),
        completePrice: completePrice.toNumber(),
      }),
    )
    const hasNextPage = typeof take === 'number' ? results.length > take : false
    if (hasNextPage) results.pop()

    const lastItem = results[results?.length - 1]
    const endCursor = lastItem?.uuid
    const edges = results.map<IEdgeType<SubscriptionAccountModel>>((account) => ({
      cursor: account.uuid,
      node: account,
    }))

    return {
      edges,
      nodes: results,
      hasNextPage,
      endCursor,
      totalCount,
    }
  }
}
