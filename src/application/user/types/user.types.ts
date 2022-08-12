import { Prisma } from '@prisma/client'

export type UserWithRoles = Prisma.UserGetPayload<{ include: { roles: true } }>

export type UserWithUserInfo = Prisma.UserGetPayload<{ include: { userInfo: true } }>
