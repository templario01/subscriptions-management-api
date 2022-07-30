import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { SessionData } from '../../application/auth/dtos/response/session-data'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles) return true
    const request = context.switchToHttp().getRequest()
    const { user } = request

    return true
  }

  private getUserFromContext(context: ExecutionContext): SessionData {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req.user
    } else {
      return context.switchToHttp().getRequest().user
    }
  }
}
