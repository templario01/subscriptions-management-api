import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { SessionData } from '../../application/auth/dtos/response/session-data'

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): SessionData => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user
  } else {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  }
})
