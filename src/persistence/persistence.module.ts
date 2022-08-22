import { Module } from '@nestjs/common'
import { SubscriptionAccountRepository } from './repositories/subscription-account.repository'
import { UserRepository } from './repositories/user.repository'
import { PrismaService } from './services/prisma.service'

const services = [UserRepository, PrismaService, SubscriptionAccountRepository]

@Module({
  imports: [],
  providers: [...services],
  exports: [...services],
})
export class PersistenceModule {}
