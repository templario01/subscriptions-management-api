import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: number

  @Field()
  phone: string

  @Field()
  username: string

  @Field()
  name: string

  @Field()
  lastName: string

  @Field()
  avatar: string
}
