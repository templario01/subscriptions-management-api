import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common'
import { BillingStatus, Prisma } from '@prisma/client'
import { CreateCustomerSubscriptionInput } from '../../application/customer-subscription/dtos/inputs/create-customer-subscription.input'
import { CreateCustomerInput } from '../../application/customer-subscription/dtos/inputs/create-customer.input'
import { CreateSubscriptionInput } from '../../application/customer-subscription/dtos/inputs/create-subscription.input'
import { SubscriptionWithAccount } from '../../application/customer-subscription/types/subscription.types'
import { PrismaService } from '../services/prisma.service'
import { UserRepository } from './user.repository'
import { customAlphabet } from 'nanoid/async'
import { DateTime } from 'luxon'

const ROBOHASH_HOST = 'https://robohash.org'
@Injectable()
export class CustomerSubscriptionRepository {
  private readonly logger: Logger
  constructor(private readonly prisma: PrismaService, private readonly userRepository: UserRepository) {
    this.logger = new Logger(CustomerSubscriptionRepository.name)
  }

  async creatSubscriptions({
    customer,
    subscriptions,
    ...input
  }: CreateCustomerSubscriptionInput): Promise<SubscriptionWithAccount[]> {
    try {
      const transactionResponse = await this.prisma.$transaction(async (prismaClient) => {
        const newCustomer = await this.createCustomer(prismaClient, customer)
        const newBilling = await prismaClient.billing.create({
          data: {
            customer: {
              connect: {
                id: newCustomer.id,
              },
            },
            status: input.status,
            totalAmount: input.totalPrice,
          },
        })
        const billingNextMonth = await prismaClient.billing.create({
          data: {
            createdAt: DateTime.fromJSDate(newBilling.createdAt).plus({ month: 1 }).toJSDate(),
            customer: {
              connect: {
                id: newCustomer.id,
              },
            },
            status: BillingStatus.PENDING,
            totalAmount: input.totalPrice,
          },
        })
        const customerPackage = await prismaClient.customerPackage.create({
          data: {
            customer: {
              connect: {
                id: newCustomer.id,
              },
            },
            BillingDetail: {
              create: {
                quantity: 1,
                Billing: {
                  connect: {
                    id: newBilling.id,
                  },
                },
              },
            },
            ...input,
          },
        })

        await prismaClient.billingDetail.create({
          data: {
            quantity: 1,
            Billing: {
              connect: {
                id: billingNextMonth.id,
              },
            },
            costumerPackage: {
              connect: {
                id: customerPackage.id,
              },
            },
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
    const customer = await this.prisma.customer.findFirst({
      where: {
        phone,
      },
    })

    if (customer) {
      throw new BadRequestException(`cliente con el numero ${phone} ya ha sido registrado`)
    }

    const randomCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ', 4)

    return prismaClient.customer.create({
      data: {
        userInfo: {
          create: {
            avatar: `${ROBOHASH_HOST}/${phone}`,
            ...input,
          },
        },
        phone,
        code: await randomCode(),
      },
    })
  }

  async createSubscription(
    prismaClient: Prisma.TransactionClient,
    input: CreateSubscriptionInput,
    cutomerPackageUUID: string,
  ): Promise<SubscriptionWithAccount> {
    const account = await this.prisma.subscriptionAccount.findFirst({
      where: { uuid: input.subscriptionAccountUUID },
      include: { platform: true },
    })

    if (!account) {
      throw new NotFoundException(`account ${input.subscriptionAccountUUID} does not exist`)
    }

    const { availableSlots, email, platform, id } = account
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
    })

    await prismaClient.subscriptionAccount.update({
      where: {
        id,
      },
      data: {
        availableSlots: availableSlots - input.slotsNumber,
      },
    })

    return prismaClient.subscription.findUnique({
      where: { id: subscription.id },
      include: {
        suscriptionAccount: {
          include: {
            platform: true,
          },
        },
      },
    })
  }
}
