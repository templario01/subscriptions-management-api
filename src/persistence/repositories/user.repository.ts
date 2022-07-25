import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(mail: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        username: {
          equals: mail,
          mode: 'insensitive',
        },
      },
    })
  }

  async findUserByPhone(phone: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        phone: {
          equals: phone,
          mode: 'insensitive',
        },
      },
    })
  }

  async createUser(user: User): Promise<User> {
    return await this.prisma.user.create({ data: user })
  }
}
