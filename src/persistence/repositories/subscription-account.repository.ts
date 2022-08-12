import { Injectable } from '@nestjs/common'
import { CreateSubscriptionAccountInput } from '../../application/subscription-account/dtos/inputs/create-subscription-account.input'
import { SubscriptionWithPlatform } from '../../application/subscription-account/types/subscription-account.types'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class SubscriptionAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscriptionAccount({
    email,
    password,
    platformUUID,
  }: CreateSubscriptionAccountInput): Promise<SubscriptionWithPlatform> {
    return this.prisma.subscriptionAccount.create({
      data: {
        email,
        password,
        platform: {
          connect: { uuid: platformUUID },
        },
      },
      include: { platform: true },
    })
  }
}
