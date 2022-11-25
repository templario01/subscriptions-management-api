import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { IPaginatedResponse, PaginatedResponse } from '../../../../utils/pagination/cursor-pagination'

import { PlatformModel } from '../../../platform/dtos/models/platform.model'

@ObjectType()
export class SubscriptionAccountModel {
  @Field()
  email: string

  @Field()
  password: string

  @Field(() => PlatformModel)
  platform: PlatformModel

  @Field()
  uuid: string

  @Field(() => GraphQLISODateTime)
  createdAt: Date

  @Field(() => GraphQLISODateTime)
  updatedAt: Date

  @Field()
  completePrice: number

  @Field(() => Boolean, { nullable: true })
  isSoldBySlots?: boolean

  @Field(() => Boolean)
  isActive: boolean

  @Field({ nullable: true })
  slotPrice?: number
}

@ObjectType('PaginatedSubscriptionAccountModel')
export class PaginatedSubscriptionAccountModel extends PaginatedResponse(SubscriptionAccountModel) {}
export type IPaginatedSubscriptionAccountModel = IPaginatedResponse<SubscriptionAccountModel>
