import { Query, Resolver } from '@nestjs/graphql'
import { UserModel } from 'src/application/user/models/user.model'

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
