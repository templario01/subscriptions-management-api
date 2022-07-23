import { Query, Resolver } from '@nestjs/graphql'
import { UserModel } from '../../application/user/models/user.model'

@Resolver(() => UserModel)
export class UserResolver {
  constructor() {
    //
  }

  @Query(() => UserModel, { name: 'user' })
  async getUserInfo(): Promise<UserModel> {
    return null
  }
}
