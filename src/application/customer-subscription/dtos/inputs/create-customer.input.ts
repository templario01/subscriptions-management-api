import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator'

@InputType()
export class CreateCustomerInput {
  @Field()
  @IsNumberString()
  @IsNotEmpty()
  @Length(9, 9)
  phone: string

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  alias?: string

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string
}
