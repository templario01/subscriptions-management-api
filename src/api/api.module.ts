import { Module } from '@nestjs/common'
import { ApplicationModule } from '../application/application.module'
import { UserResolver } from './resolvers/user.resolver'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from './resolvers/auth.resolver'

const resolvers = [UserResolver, AuthResolver]
const controllers = []

@Module({
  imports: [PassportModule, ApplicationModule],
  controllers: [...controllers],
  providers: [...resolvers],
})
export class ApiModule {}
