import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { compare, genSalt, hash } from 'bcrypt'
import { LoginUserInput } from '../dtos/inputs/login.input'

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

  async validateByUsername(username: string, password: string) {
    try {
      return await this.userRepository.validateUserAndPassword(username, password)
    } catch (error) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED)
    }
  }
  async validateUser(username: string, password: string): Promise<Partial<User>> {
    const user = await this.userRepository.validateUser(username)
    if (!user) throw new Error('User not found')
    return compare(password, user.password) ? { username: user.username, id: user.id, phone: user.phone } : null
  }

  async verify(token: string) {
    const decoded = await this.jwtService.verify(token, { secret: 'secret' })
    const user = await this.userRepository.getUserById(decoded.sub)
    if (!user) throw new HttpException('unable to get user from decoded token', HttpStatus.UNAUTHORIZED)
    return user
  }

  async login(user: User) {
    const accessToken = this.jwtService.sign({ username: user.username, sub: user.id })
    return {
      accessToken,
      user,
    }
  }
  // return { accessToken: this.jwtService.sign(payload, { secret: 'secret' }) }

  async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt(10)
    return hash(password, salt)
  }

  comparePassword(password: string, savedPassword: string): Promise<boolean> {
    return compare(password, savedPassword)
  }
}
