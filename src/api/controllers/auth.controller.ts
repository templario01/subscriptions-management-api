import { IAuthService } from '../../application/auth/services/auth.service.interface'
import { Controller, Post, UseGuards, Req } from '@nestjs/common'
import { LoginAuthGuard } from '../guards/login-auth.guard'
import { UserRequest } from '../../application/auth/dtos/response/auth.response'
import { LoginDto } from '@application/auth/dtos/requests/login.dto'
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator'

interface AuthResponse {
  accessToken: string
  refreshToken: string
}

@Controller()
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LoginAuthGuard)
  @Post('login')
  async login(@Req() request: UserRequest): Promise<AuthResponse> {
    return this.authService.login(request.user)
  }
}
