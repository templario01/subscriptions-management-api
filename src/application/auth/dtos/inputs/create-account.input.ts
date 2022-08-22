import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator'

@InputType()
export class CreateAccountInput {
  @Field()
  @IsNumberString()
  @IsNotEmpty()
  @Length(9, 9)
  phone: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email?: string

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

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string
}
