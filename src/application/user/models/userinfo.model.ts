import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserInfo')
export class UserInfoModel {
  @Field({ nullable: true })
  firstName: string

  @Field({ nullable: true })
  lastName: string

  @Field()
  avatar: string
}
