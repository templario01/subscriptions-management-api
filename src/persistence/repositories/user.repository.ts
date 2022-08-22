import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { CreateAccountInput } from '../../application/auth/dtos/inputs/create-account.input'
import { RolesEnum } from '../../application/common/roles.enum'
import { UpdateAccountInput } from '../../application/user/dtos/input/update-user.input'
import { UserWithRoles, UserWithUserInfo } from '../../application/user/types/user.types'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUUID(uuid: string): Promise<UserWithUserInfo> {
    return this.prisma.user.findUnique({
      where: { uuid },
      include: { userInfo: true },
    })
  }

  async editUserInfo({
    uuid,
    email,
    password,
    phone,
    isActive,
    ...userInfo
  }: UpdateAccountInput): Promise<UserWithUserInfo> {
    const passwordEncrypted = password ? await this.encryptPassword(password) : await this.encryptPassword(phone)
    return this.prisma.user.update({
      where: { uuid },
      data: {
        username: email,
        password: passwordEncrypted,
        isActive,
        phone,
        userInfo: {
          update: { ...userInfo },
        },
      },
      include: { userInfo: true },
    })
  }

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

  async createAccount(
    { phone, email, password, ...userInfo }: CreateAccountInput,
    url: string,
  ): Promise<UserWithUserInfo> {
    const passwordEncrypted = password ? await this.encryptPassword(password) : await this.encryptPassword(phone)
    return this.prisma.user.create({
      data: {
        username: email,
        password: passwordEncrypted,
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

  private async encryptPassword(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass, salt)
  }
}
