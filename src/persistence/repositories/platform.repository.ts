import { PlatformModel } from '@application/platform/dtos/models/platform.model'
import { Logger, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Platform } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PlatformRepository {
  private readonly logger: Logger
  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(PlatformRepository.name)
  }

  async getPlatformByUUID(uuid: string): Promise<Platform> {
    return this.prisma.platform.findUnique({
      where: {
        uuid,
      },
    })
  }

  async getPlatformsByName(name?: string): Promise<PlatformModel[]> {
    try {
      const platforms = await this.prisma.platform.findMany({
        ...(name && {
          where: {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
        }),
      })

      const parsedPlatforms = platforms.map(({ uuid, name, logo }) =>
        plainToInstance(PlatformModel, { uuid, name, logo }),
      )

      return parsedPlatforms
    } catch (error) {
      this.logger.error(error)

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createPlatform(name: string, userId: number) {
    return this.prisma.userManagePlatform.create({
      data: {
        platform: {
          create: {
            name,
            logo: `https://ui-avatars.com/api/?bold=true&background=000&color=fff&name=${name}`,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async assignPlatform(platformId: number, userId: number) {
    return this.prisma.userManagePlatform.upsert({
      where: {
        userId_platformId: {
          userId,
          platformId,
        },
      },
      create: {
        platform: {
          connect: {
            id: platformId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {
        assignedAt: new Date(),
      },
    })
  }

  async getManagedPlatforms(userId: number) {
    return this.prisma.platform.findMany({
      where: {
        managers: {
          some: {
            userId,
          },
        },
      },
    })
  }
}
