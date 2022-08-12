import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateAccountInput } from '../../application/auth/dtos/inputs/create-account.input'
import { RolesEnum } from '../../application/common/roles.enum'
import { UserWithRoles, UserWithUserInfo } from '../../application/user/types/user.types'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerSessionById(id: number, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        lastSession: new Date(),
        refreshToken,
      },
    })
  }

  async findUserByEmail(mail: string): Promise<UserWithRoles> {
    return this.prisma.user.findFirst({
      where: {
        username: {
          equals: mail,
          mode: 'insensitive',
        },
      },
      include: { roles: true },
    })
  }

  async findUserByPhone(phone: string): Promise<UserWithRoles> {
    return this.prisma.user.findFirst({
      where: {
        phone: {
          equals: phone,
          mode: 'insensitive',
        },
      },
      include: { roles: true },
    })
  }

  async createUser(user: User): Promise<User> {
    return this.prisma.user.create({ data: user })
  }

  async createAccount({ phone, email, ...userInfo }: CreateAccountInput, url: string): Promise<UserWithUserInfo> {
    return this.prisma.user.create({
      data: {
        username: email,
        password: phone,
        userInfo: {
          create: { ...userInfo, avatar: url },
        },
        roles: { connect: { name: RolesEnum.USER } },
        phone,
      },
      include: {
        userInfo: true,
      },
    })
  }
}
