import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'
import bcrypt from 'bcrypt'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByPhone(phone: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { phone } })
  }

  async findByUsername(username: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { username } })
  }

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } })
  }
  async validateUserAndPassword(username: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return bcrypt.compare(password, user.password)
  }

  async validateUser(username: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    })
  }
}
