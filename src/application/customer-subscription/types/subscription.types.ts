import { Prisma } from '@prisma/client'

export type SubscriptionWithAccount = Prisma.SubscriptionGetPayload<{
  include: {
    suscriptionAccount: {
      include: {
        platform: true
      }
    }
  }
}>
