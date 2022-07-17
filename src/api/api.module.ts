import { Module } from '@nestjs/common'
import { UserResolver } from './resolvers/user.resolver'

const resolvers = [UserResolver]
const controllers = []

@Module({
  imports: [],
  controllers: [...controllers],
  providers: [...resolvers],
})
export class ApiModule {}
