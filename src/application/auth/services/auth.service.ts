import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { compare, genSalt, hash } from 'bcrypt'
import { LoginUserInput } from '../dtos/inputs/login.input'
import { UserWithoutRelations } from '../dtos/response/user.response.dto'
import { plainToClass } from 'class-transformer'

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

  async validateUserByMail(email: string, password: string): Promise<UserWithoutRelations> {
    const user = await this.userRepository.findUserByEmail(email)
    const matchPassword = await compare(password, user.password)
    if (user && matchPassword) {
      return plainToClass(UserWithoutRelations, user)
    }
    throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED)
  }

  async validateUserByPhone(phone: string, password: string): Promise<UserWithoutRelations> {
    const user = await this.userRepository.findUserByPhone(phone)
    const matchPassword = await compare(password, user.password)
    if (user && matchPassword) {
      return plainToClass(UserWithoutRelations, user)
    }
    throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED)
  }

  async login(user: User) {
    const accessToken = this.jwtService.sign({ username: user.username, sub: user.id })
    return {
      accessToken,
      user,
    }
  }

  async validateUserRequest(username: string, password: string): Promise<UserWithoutRelations> {
    const isMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)
    if (isMail) {
      return this.validateUserByMail(username, password)
    }
    return this.validateUserByPhone(username, password)
  }
}
