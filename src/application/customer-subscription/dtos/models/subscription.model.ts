import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { SubscriptionAccountModel } from '../../../subscription-account/dtos/models/subscription-account.model'

@ObjectType('SubscriptionModel')
export class SubscriptionModel {
  @Field(() => ID)
  uuid: string

  @Field(() => GraphQLISODateTime)
  createdAt: Date

  @Field(() => GraphQLISODateTime)
  updatedAt: Date

  @Field(() => Float)
  customPrice: number

  @Field(() => Int)
  screenSlots: number

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => [SubscriptionAccountModel])
  suscriptionAccount: SubscriptionAccountModel[]
}
