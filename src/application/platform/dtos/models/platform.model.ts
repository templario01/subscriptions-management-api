import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PlatformModel {
  @Field()
  uuid: string

  @Field()
  name: string

  @Field({ nullable: true })
  logo: string

  @Field()
  defaultPrice: string
}
