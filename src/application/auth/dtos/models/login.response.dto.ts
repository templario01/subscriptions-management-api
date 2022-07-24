import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from '../../../user/models/user.model'

@ObjectType()
export class LoginResponseModel {
  @Field()
  accessToken: string

  @Field(() => UserModel)
  user: UserModel
}
