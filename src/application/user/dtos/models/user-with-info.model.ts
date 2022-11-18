import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserInfoModel } from './userinfo.model'

@ObjectType('UserWithInfo')
export class UserWithInfoModel {
  @Field(() => ID)
  uuid: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  username?: string

  @Field(() => UserInfoModel)
  userInfo: UserInfoModel
}
