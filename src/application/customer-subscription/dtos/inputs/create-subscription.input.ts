import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@InputType()
export class CreateSubscriptionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  subscriptionAccountUUID: string

  @Field(() => Float)
  @IsNumber()
  customPrice: number

  @Field(() => Int)
  @IsNumber()
  slotsNumber: number
}
