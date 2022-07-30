import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AcccessTokenResponseModel {
  @Field()
  accessToken: string
}
