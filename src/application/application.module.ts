import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PersistenceModule } from '../persistence/persistence.module'
import { provideService } from '../utils/provide-service'
import { AuthService } from './auth/services/auth.service'
import { IAuthService } from './auth/services/auth.service.interface'
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { LocalStrategy } from './auth/strategies/local.strategy'
import { SubscriptionAccountService } from './subscription-account/services/subscription-account.service'
import { ISubscriptionAccountService } from './subscription-account/services/subscription-account.service.interface'

const services = [
  provideService(IAuthService, AuthService),
  provideService(ISubscriptionAccountService, SubscriptionAccountService),
]
const strategies = [LocalStrategy, JwtStrategy]

@Module({
  exports: [...services],
  imports: [PersistenceModule, JwtModule.register({ signOptions: { expiresIn: '1h' }, secret: 'secret' })],
  providers: [...services, ...strategies],
  controllers: [],
})
export class ApplicationModule {}
