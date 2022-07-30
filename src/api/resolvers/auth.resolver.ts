import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { LoginUserInput } from '../../application/auth/dtos/inputs/login.input'
import { AcccessTokenResponseModel } from '../../application/auth/dtos/models/accesstoken-response.model'
import { UserRequest } from '../../application/auth/dtos/response/auth.response'
import { AuthService } from '../../application/auth/services/auth.service'
import { GqlLoginAuthGuard } from '../guards/login-auth.guard'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlLoginAuthGuard)
  @Mutation(() => AcccessTokenResponseModel, { name: 'login' })
  login(@Args('loginUserInput') params: LoginUserInput, @Context() context: UserRequest) {
    return this.authService.login(context.user)
  }
}
