import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { UserWithRoles } from '../../application/user/types/user.types'
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
}
