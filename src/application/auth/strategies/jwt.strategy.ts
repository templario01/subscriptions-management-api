import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { SessionData } from '../dtos/response/session-data'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
      logging: true,
    })
  }

  async validate(payload: SessionData) {
    return {
      userId: payload.id,
      username: payload.username,
      phone: payload.phone,
      roles: payload.roles,
    }
  }
}
