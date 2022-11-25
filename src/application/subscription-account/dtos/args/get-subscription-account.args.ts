import { ArgsType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CursorPagination } from '../../../../utils/pagination/cursor-pagination'

@ArgsType()
export class GetSubscriptionAccount extends CursorPagination {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string
}
