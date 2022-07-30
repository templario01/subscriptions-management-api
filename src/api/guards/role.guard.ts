import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { SessionData } from '../../application/auth/dtos/response/auth.response'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler())
    if (!allowedRoles) return true
    const user = this.getUserFromContext(context)

    return allowedRoles.some((role) => user.roles.includes(role))
  }

  private getUserFromContext(context: ExecutionContext): SessionData {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req.user
    } else {
      return context.switchToHttp().getRequest().user
    }
  }
}
