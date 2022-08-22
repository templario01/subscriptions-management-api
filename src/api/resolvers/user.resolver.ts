import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { plainToClass } from 'class-transformer'
import { UserModel } from '../../application/auth/dtos/models/user.model'
import { SessionData } from '../../application/auth/dtos/response/auth.response'
import { RolesEnum } from '../../application/common/roles.enum'
import { UpdateAccountInput } from '../../application/user/dtos/input/update-user.input'
import { UserWithInfoModel } from '../../application/user/dtos/models/user-with-info.model'
import { IUserService } from '../../application/user/services/user.service.interface'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver(() => UserWithInfoModel)
export class UserResolver {
  constructor(private readonly userService: IUserService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => UserModel, { name: 'getCurrentUser' })
  async getCurrentUser(@CurrentUser() user: SessionData): Promise<UserModel> {
    return plainToClass(UserModel, user)
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Mutation(() => UserWithInfoModel, { name: 'updateUserAccount' })
  async updateUserAccount(@Args('createAccountInput') params: UpdateAccountInput): Promise<UserWithInfoModel> {
    return this.userService.updateUserInfo(params)
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => UserModel, { name: 'getUserInfo' })
  async getUserInfo(@Args('uuid', { type: () => ID }) uuid: string): Promise<UserWithInfoModel> {
    return this.userService.getUserInfo(uuid)
  }
}
