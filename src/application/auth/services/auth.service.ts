import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { SessionData, TokenResponse } from '../dtos/response/auth.response'
import { UserWithRoles } from '../../user/types/user.types'
import { AccessTokenResponseModel } from '../dtos/models/accesstoken-response.model'
import { EnvConfigService } from '../../../config/env-config.service'
import { CreateAccountInput } from '../dtos/inputs/create-account.input'
import { plainToClass } from 'class-transformer'
import { UserWithInfoModel } from '../../user/dtos/models/user-with-info.model'
import { nanoid } from 'nanoid'
import { IAuthService } from './auth.service.interface'
import { CreateAdminAccountInput } from '../dtos/inputs/create-admin-account.input'

const ROBOHASH_HOST = 'https://robohash.org'
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: EnvConfigService,
  ) {}

  async login(user: SessionData): Promise<AccessTokenResponseModel> {
    const accessToken = this.createAccessToken(user).token
    const refreshToken = this.createRefreshToken(user).token
    await this.userRepository.registerSessionById(user.id, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }

  async getRefreshToken(token: string): Promise<AccessTokenResponseModel> {
    const user = await this.userRepository.getByToken(token)
    if (!user) {
      throw new HttpException('bad refresh token', HttpStatus.FORBIDDEN)
    }
    const userSession: SessionData = {
      id: user.id,
      roles: user.roles.map((rol) => rol.name),
      phone: user.phone,
      username: user.username,
    }
    const accessToken = this.createAccessToken(userSession).token
    const refreshToken = this.createRefreshToken(userSession).token
    await this.userRepository.registerSessionById(user.id, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }

  getSessionData(user: UserWithRoles): SessionData {
    const { id, username, phone, userInfo } = user
    const userRoles = user.roles.map((e) => e.name)

    return { id, username, phone, roles: userRoles, avatar: userInfo.avatar }
  }

  createAccessToken(user: SessionData): TokenResponse {
    const config = this.configService.jwtConfig()

    return {
      token: this.jwtService.sign(user, {
        secret: config.jwtSecretKey,
        expiresIn: `${config.jwtExpirationTime}s`,
      }),
    }
  }

  createRefreshToken(user: SessionData): TokenResponse {
    const config = this.configService.jwtConfig()

    return {
      token: this.jwtService.sign(user, {
        secret: config.jwtRefreshSecretKey,
        expiresIn: `${config.jwtRefreshExpirationTime}s`,
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

  async createCustomerAccount(input: CreateAccountInput): Promise<UserWithInfoModel> {
    const user = await this.userRepository.findUserByPhone(input.phone)
    if (user) {
      throw new HttpException('email or phone number already exists', HttpStatus.BAD_REQUEST)
    }
    const avatarUrl = this.generateImageUrl()
    const account = await this.userRepository.createAccount(input, avatarUrl)

    return plainToClass(UserWithInfoModel, account)
  }

  async createAdminAccount(input: CreateAdminAccountInput): Promise<UserWithInfoModel> {
    const user = await this.userRepository.findUserByEmail(input.email)
    if (user) {
      throw new HttpException('email already taken', HttpStatus.BAD_REQUEST)
    }
    const avatarUrl = this.generateImageUrl()
    const account = await this.userRepository.createAdminAccount(input, avatarUrl)

    return plainToClass(UserWithInfoModel, account)
  }

  private generateImageUrl(): string {
    const nanoId = nanoid()

    return `${ROBOHASH_HOST}/${nanoId}`
  }
}
