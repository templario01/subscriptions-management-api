import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { SessionData } from '../../application/auth/dtos/response/session-data'
import { RolesEnum } from '../../application/common/roles.enum'
import { UserModel } from '../../application/user/models/user.model'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver(() => UserModel)
export class UserResolver {
  constructor() {
    //
  }

  @Roles(RolesEnum.SUPERADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => UserModel, { name: 'user' })
  async getUserInfo(@CurrentUser() user: SessionData): Promise<UserModel> {
    console.log(user)
    const resp = new UserModel()
    resp.id = 1
    resp.username = 'test'
    resp.avatar = 'test'
    resp.name = 'test'
    return resp
  }
}
