import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { SessionData } from '../../application/auth/dtos/response/auth.response'
import { RolesEnum } from '../../application/common/roles.enum'
import { UserWithInfoModel } from '../../application/user/models/user-with-info.model'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver(() => UserWithInfoModel)
export class UserResolver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Roles(RolesEnum.SUPERADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => UserWithInfoModel, { name: 'user' })
  async getUserInfo(@CurrentUser() user: SessionData): Promise<UserWithInfoModel> {
    console.log(user)
    const resp = new UserWithInfoModel()
    return resp
  }
}
