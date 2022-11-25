import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

@InputType()
export class CreateSubscriptionAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  email: string

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string

  @Field()
  @IsString()
  @IsNotEmpty()
  platformUUID: string

  @Field()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  completePrice: number

  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isSoldBySlots: boolean

  @Field()
  @IsNumber()
  @IsPositive()
  slots?: number

  @Field()
  @IsNumber()
  @IsPositive()
  slotPrice?: number
}
