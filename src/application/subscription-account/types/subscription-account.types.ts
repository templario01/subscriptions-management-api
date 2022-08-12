import { Prisma } from '@prisma/client'

export type SubscriptionWithPlatform = Prisma.SubscriptionAccountGetPayload<{ include: { platform: true } }>
