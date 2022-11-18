import { Module } from '@nestjs/common'
import { ApplicationModule } from '../application/application.module'
import { UserResolver } from './resolvers/user.resolver'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from './resolvers/auth.resolver'
import { SubscriptionAccountResolver } from './resolvers/subscription-account.resolver'
import { AuthController } from './controllers/auth.controller'

const resolvers = [UserResolver, AuthResolver, SubscriptionAccountResolver]
const controllers = [AuthController]

@Module({
  imports: [PassportModule, ApplicationModule],
  controllers: [...controllers],
  providers: [...resolvers],
})
export class ApiModule {}
