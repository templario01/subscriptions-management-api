import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  readonly id: string

  @Field()
  readonly phone: string

  @Field()
  readonly username: string

  @Field()
  readonly name: string

  @Field()
  readonly lastName: string

  @Field()
  readonly avatar: string
}
