import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { SessionData } from '../dtos/response/session-data'
import { AcccessTokenResponse, UserWithRoles } from '../types/user.types'

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

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

  getSessionData(user: UserWithRoles): SessionData {
    const { id, username, phone } = user
    const userRoles = user.roles.map((e) => e.name)
    return { id, username, phone, roles: userRoles }
  }

  login(user: SessionData): AcccessTokenResponse {
    const { id, username, phone, roles } = user
    const accessToken = this.jwtService.sign({ username, phone, id, roles })
    return { accessToken }
  }

  async validateUserRequest(username: string, password: string): Promise<SessionData> {
    const isMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)
    if (isMail) {
      return this.validateUserByMail(username, password)
    }
    return this.validateUserByPhone(username, password)
  }
}
