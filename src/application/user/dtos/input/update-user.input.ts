import { Field, ID, InputType, PartialType } from '@nestjs/graphql'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { CreateAccountInput } from '../../../auth/dtos/inputs/create-account.input'

@InputType()
export class UpdateAccountInput extends PartialType(CreateAccountInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  uuid: string

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean
}
