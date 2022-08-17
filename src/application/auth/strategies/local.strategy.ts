import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { IAuthService } from '../services/auth.service.interface'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: IAuthService) {
    super()
  }

  async validate(username: string, password: string) {
    return await this.authService.validateLogin(username, password)
  }
}
