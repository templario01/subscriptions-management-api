import { BadRequestException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { RolesEnum } from '../../application/common/roles.enum'
import { CreateCustomerSubscriptionInput } from '../../application/customer-subscription/dtos/inputs/create-customer-subscription.input'
import { CreateCustomerInput } from '../../application/customer-subscription/dtos/inputs/create-customer.input'
import { CreateSubscriptionInput } from '../../application/customer-subscription/dtos/inputs/create-subscription.input'
import { SubscriptionWithAccount } from '../../application/customer-subscription/types/subscription.types'
import { encryptPassword } from '../../utils/user.utils'
import { PrismaService } from '../services/prisma.service'
import { UserRepository } from './user.repository'

const ROBOHASH_HOST = 'https://robohash.org'
@Injectable()
export class UserSubscriptionRepository {
  private readonly logger: Logger
  constructor(private readonly prisma: PrismaService, private readonly userRepository: UserRepository) {
    this.logger = new Logger(UserSubscriptionRepository.name)
  }

  async creatSubscriptions({
    customer,
    subscriptions,
    ...input
  }: CreateCustomerSubscriptionInput): Promise<SubscriptionWithAccount[]> {
    try {
      const transactionResponse = await this.prisma.$transaction(async (prismaClient) => {
        const newCustomer = await this.createCustomer(prismaClient, customer)
        const customerPackage = await prismaClient.customerPackage.create({
          data: {
            user: {
              connect: {
                id: newCustomer.id,
              },
            },
            ...input,
          },
        })
        const subscriptionTasks = subscriptions.map(async ({ ...input }) => {
          return this.createSubscription(prismaClient, input, customerPackage.uuid)
        })

        const subscriptionsCreated = await Promise.all(subscriptionTasks)

        return subscriptionsCreated
      })

      return transactionResponse
    } catch (error) {
      this.logger.error(error)

      throw new UnprocessableEntityException(error)
    }
  }

  async createCustomer(prismaClient: Prisma.TransactionClient, { phone, ...input }: CreateCustomerInput) {
    const customer = await this.prisma.user.findFirst({
      where: {
        phone,
      },
      rejectOnNotFound: false,
    })
    if (customer) {
      throw new BadRequestException(`cliente con el numero ${phone} ya ha sido registrado`)
    }

    const password = await encryptPassword(phone)
    return prismaClient.user.create({
      data: {
        userInfo: {
          create: {
            avatar: `${ROBOHASH_HOST}/${phone}`,
            ...input,
          },
        },
        roles: {
          connect: {
            name: RolesEnum.USER,
          },
        },
        phone,
        password,
      },
    })
  }

  async createSubscription(
    prismaClient: Prisma.TransactionClient,
    input: CreateSubscriptionInput,
    cutomerPackageUUID: string,
  ): Promise<SubscriptionWithAccount> {
    const { availableSlots, email, platform, id } = await this.prisma.subscriptionAccount.findUnique({
      where: { uuid: input.subscriptionAccountUUID },
      include: { platform: true },
    })
    if (availableSlots === 0 || input.slotsNumber > availableSlots) {
      throw new BadRequestException(`No hay slots disponibles para la cuenta ${email} de ${platform.name}`)
    }

    const subscription = await prismaClient.subscription.create({
      data: {
        suscriptionAccount: {
          connect: {
            uuid: input.subscriptionAccountUUID,
          },
        },
        customerPackage: {
          connect: {
            uuid: cutomerPackageUUID,
          },
        },
        customPrice: input.customPrice,
        screenSlots: input.slotsNumber,
      },
      include: {
        suscriptionAccount: {
          include: {
            platform: true,
          },
        },
      },
    })

    await prismaClient.subscriptionAccount.update({
      where: {
        id,
      },
      data: {
        availableSlots: availableSlots - input.slotsNumber,
      },
    })

    return subscription
  }
}
