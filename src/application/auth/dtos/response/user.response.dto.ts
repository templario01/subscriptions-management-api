import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class UserWithoutRelations {
  @Expose()
  readonly id: number

  @Expose()
  readonly phone: string

  @Expose()
  readonly username: string
}
