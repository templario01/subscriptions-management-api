import { Module } from '@nestjs/common'
import { PersistenceModule } from '../persistence/persistence.module'
import { provideService } from '../utils/provide-service'
import { AuthService } from './auth/services/auth.service'
import { IAuthService } from './auth/services/auth.service.interface'
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { LocalStrategy } from './auth/strategies/local.strategy'
import { CustomerSubscriptionService } from './customer-subscription/services/customer-subscription.service'
import { ICustomerSubscriptionService } from './customer-subscription/services/customer-subscription.service.interface'
import { PlatformService } from './platform/services/platform.service'
import { IPlatformService } from './platform/services/platform.service.interface'
import { SubscriptionAccountService } from './subscription-account/services/subscription-account.service'
import { ISubscriptionAccountService } from './subscription-account/services/subscription-account.service.interface'
import { UserService } from './user/services/user.service'
import { IUserService } from './user/services/user.service.interface'

const services = [
  provideService(IAuthService, AuthService),
  provideService(ISubscriptionAccountService, SubscriptionAccountService),
  provideService(IUserService, UserService),
  provideService(IPlatformService, PlatformService),
  provideService(ICustomerSubscriptionService, CustomerSubscriptionService),
]
const strategies = [LocalStrategy, JwtStrategy]

@Module({
  exports: [...services],
  imports: [PersistenceModule],
  providers: [...services, ...strategies],
  controllers: [],
})
export class ApplicationModule {}
