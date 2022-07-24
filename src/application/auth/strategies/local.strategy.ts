import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super()
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository.validateUser(username)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
