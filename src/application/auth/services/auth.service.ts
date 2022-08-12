import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { SessionData, TokenResponse } from '../dtos/response/auth.response'
import { UserWithRoles } from '../../user/types/user.types'
import { AcccessTokenResponseModel } from '../dtos/models/accesstoken-response.model'
import { EnvConfigService } from '../../../config/env-config.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: EnvConfigService,
  ) {}

  async login(user: SessionData): Promise<AcccessTokenResponseModel> {
    const refreshToken = this.createRefreshToken(user).token
    const session = await this.userRepository.registerSessionById(user.id, refreshToken)
    return {
      accessToken: this.createAccessToken(user).token,
      refreshToken: session.refreshToken,
    }
  }

  getSessionData(user: UserWithRoles): SessionData {
    const { id, username, phone } = user
    const userRoles = user.roles.map((e) => e.name)
    return { id, username, phone, roles: userRoles }
  }

  createAccessToken(user: SessionData): TokenResponse {
    const config = this.configService.jwtConfig()
    return {
      token: this.jwtService.sign(user, {
        secret: config.jwtSecretKey,
        expiresIn: `${config.jwtExpirationTime}`,
      }),
    }
  }

  createRefreshToken(user: SessionData) {
    const config = this.configService.jwtConfig()
    return {
      token: this.jwtService.sign(user, {
        secret: config.jwtRefreshSecretKey,
        expiresIn: `${config.jwtRefreshExpirationTime}`,
      }),
    }
  }

  async validateUserByMail(email: string, password: string): Promise<SessionData> {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) return
    const matchPassword = await compare(password, user.password)
    return matchPassword ? this.getSessionData(user) : null
  }

  async validateUserByPhone(phone: string, password: string): Promise<SessionData> {
    const user = await this.userRepository.findUserByPhone(phone)
    if (!user) return
    const matchPassword = await compare(password, user.password)
    return matchPassword ? this.getSessionData(user) : null
  }

  async validateLogin(username: string, password: string): Promise<SessionData> {
    const isMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)
    if (isMail) {
      return this.validateUserByMail(username, password)
    }
    return this.validateUserByPhone(username, password)
  }
}
