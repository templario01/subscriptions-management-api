import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class UserSubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSuscriptionToUser() {
    return this.prisma.subscription.create({
      data: {
        user: {
          connect: {
            uuid: '123',
          },
        },
        suscriptionAccount: {
          connect: {
            uuid: '123',
          },
        },
        billingDate: new Date(),
        customPrice: 0,
        screenSlots: 2,
        startDate: new Date(),
      },
    })
  }
}
