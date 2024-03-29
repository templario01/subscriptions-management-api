import { Module } from '@nestjs/common'
import { PlatformRepository } from './repositories/platform.repository'
import { SubscriptionAccountRepository } from './repositories/subscription-account.repository'
import { UserRepository } from './repositories/user.repository'
import { CustomerSubscriptionRepository } from './repositories/customer-subscription.repository'
import { PrismaService } from './services/prisma.service'

const services = [
  UserRepository,
  PrismaService,
  SubscriptionAccountRepository,
  PlatformRepository,
  CustomerSubscriptionRepository,
]

@Module({
  imports: [],
  providers: [...services],
  exports: [...services],
})
export class PersistenceModule {}
