import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql'
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator'
import { CreateCustomerInput } from './create-customer.input'
import { CreateSubscriptionInput } from './create-subscription.input'

@InputType()
export class CreateCustomerSubscriptionInput {
  @Field(() => CreateCustomerInput)
  @ValidateNested()
  customer: CreateCustomerInput

  @Field(() => [CreateSubscriptionInput])
  @ValidateNested({ each: true })
  subscriptions: CreateSubscriptionInput[]

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Field()
  description: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  totalPrice: number

  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  customPackagePrice: number

  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  discountPrice: number

  @IsDate()
  @Field(() => GraphQLISODateTime)
  billingDate: Date
}
