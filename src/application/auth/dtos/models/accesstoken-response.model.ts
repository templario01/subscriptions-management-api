import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AccessTokenResponseModel {
  @Field()
  accessToken: string

  @Field()
  refreshToken: string
}
