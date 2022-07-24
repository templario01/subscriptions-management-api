import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PersistenceModule } from '../persistence/persistence.module'
import { AuthService } from './auth/services/auth.service'
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { LocalStrategy } from './auth/strategies/local.strategy'

const services = [AuthService]
const strategies = [LocalStrategy, JwtStrategy]

@Module({
  exports: [...services],
  imports: [PersistenceModule, JwtModule.register({ signOptions: { expiresIn: '1h' }, secret: 'secret' })],
  providers: [...services, ...strategies],
  controllers: [],
})
export class ApplicationModule {}