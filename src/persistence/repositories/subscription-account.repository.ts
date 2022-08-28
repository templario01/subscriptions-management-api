import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { Prisma, SubscriptionAccount } from '@prisma/client'
import { CreateSubscriptionAccountInput } from '../../application/subscription-account/dtos/inputs/create-subscription-account.input'
import { SubscriptionWithPlatform } from '../../application/subscription-account/types/subscription-account.types'
import { PrismaErrorsEnum } from '../../utils/prisma-errors'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class SubscriptionAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscriptionAccount({
    email,
    password,
    platformUUID,
  }: CreateSubscriptionAccountInput): Promise<SubscriptionWithPlatform> {
    try {
      const subscriptionAccount = await this.prisma.subscriptionAccount.create({
        data: {
          email,
          password,
          platform: {
            connect: { uuid: platformUUID },
          },
        },
        include: { platform: true },
      })

      return subscriptionAccount
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
}
