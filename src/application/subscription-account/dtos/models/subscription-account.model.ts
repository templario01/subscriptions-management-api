import { Field, ObjectType } from '@nestjs/graphql'
import { PlatformModel } from '../../../platform/dtos/models/platform.model'

@ObjectType()
export class SubscriptionAccountModel {
  @Field()
  email: string

  @Field()
  password: string

  @Field(() => PlatformModel)
  platform: PlatformModel
}
