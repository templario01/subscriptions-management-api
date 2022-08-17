import { Injectable } from '@nestjs/common'
import { UserWithInfoModel } from '../../user/models/user-with-info.model'
import { UserWithRoles } from '../../user/types/user.types'
import { CreateAccountInput } from '../dtos/inputs/create-account.input'
import { AcccessTokenResponseModel } from '../dtos/models/accesstoken-response.model'
import { SessionData, TokenResponse } from '../dtos/response/auth.response'

@Injectable()
export abstract class IAuthService {
  abstract login(user: SessionData): Promise<AcccessTokenResponseModel>
  abstract getSessionData(user: UserWithRoles): SessionData
  abstract createAccessToken(user: SessionData): TokenResponse
  abstract createRefreshToken(user: SessionData): TokenResponse
  abstract validateUserByMail(email: string, password: string): Promise<SessionData>
  abstract validateUserByPhone(phone: string, password: string): Promise<SessionData>
  abstract validateLogin(username: string, password: string): Promise<SessionData>
  abstract activeAccount(input: CreateAccountInput): Promise<UserWithInfoModel>
}
