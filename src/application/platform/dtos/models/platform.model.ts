import { Field, ObjectType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { toNumber } from '../../../../utils/transform-validators'

@ObjectType()
export class PlatformModel {
  @Field()
  uuid: string

  @Field()
  name: string

  @Field({ nullable: true })
  logo?: string

  @Transform(({ value }) => toNumber(value))
  @Field()
  defaultPrice: number
}
