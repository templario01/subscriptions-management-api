import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
  @Field()
  id: number

  @Field()
  phone: string

  @Field()
  username: string

  @Field(() => [String])
  roles: string[]
}
