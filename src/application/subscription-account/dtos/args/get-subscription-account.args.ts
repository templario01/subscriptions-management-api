import { ArgsType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CursorPagination } from '../../../../utils/pagination/cursor-pagination'

@ArgsType()
export class GetSubscriptionAccountParams extends CursorPagination {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly name?: string
}
