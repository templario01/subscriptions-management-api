import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { UserModel } from '../../application/user/models/user.model'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'

@Resolver(() => UserModel)
export class UserResolver {
  constructor() {
    //
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => UserModel, { name: 'user' })
  async getUserInfo(): Promise<UserModel> {
    const resp = new UserModel()
    resp.id = 1
    resp.username = 'test'
    resp.avatar = 'test'
    resp.name = 'test'
    return resp
  }
}
