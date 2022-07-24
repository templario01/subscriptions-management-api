import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { UserModel } from '../../application/user/models/user.model'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Resolver(() => UserModel)
export class UserResolver {
  constructor() {
    //
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel, { name: 'user' })
  async getUserInfo(): Promise<UserModel> {
    return null
  }
}
