import { CreateAccountInput } from '@application/auth/dtos/inputs/create-account.input'
import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { CreateAdminAccountInput } from '../../application/auth/dtos/inputs/create-admin-account.input'
import { LoginUserInput } from '../../application/auth/dtos/inputs/login.input'
import { AccessTokenResponseModel } from '../../application/auth/dtos/models/accesstoken-response.model'
import { UserRequest } from '../../application/auth/dtos/response/auth.response'
import { IAuthService } from '../../application/auth/services/auth.service.interface'
import { RolesEnum } from '../../application/common/roles.enum'
import { UserWithInfoModel } from '../../application/user/dtos/models/user-with-info.model'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { GqlLoginAuthGuard } from '../guards/login-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: IAuthService) {}

  @Mutation(() => UserWithInfoModel, { name: 'createAdminAccount' })
  createAdminAccount(@Args('createAdminAccountInput') params: CreateAdminAccountInput) {
    return this.authService.createAdminAccount(params)
  }

  @UseGuards(GqlLoginAuthGuard)
  @Mutation(() => AccessTokenResponseModel, { name: 'login' })
  login(
    @Args('loginUserInput') params: LoginUserInput,
    @Context() context: UserRequest,
  ): Promise<AccessTokenResponseModel> {
    return this.authService.login(context.user)
  }

  @Mutation(() => AccessTokenResponseModel, { name: 'getRefreshToken' })
  getRefreshToken(@Args('token') token: string): Promise<AccessTokenResponseModel> {
    return this.authService.getRefreshToken(token)
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Mutation(() => UserWithInfoModel, { name: 'activeAccount' })
  activeAccount(@Args('data') params: CreateAccountInput): Promise<UserWithInfoModel> {
    return this.authService.createCustomerAccount(params)
  }
}
