import { Injectable } from '@nestjs/common'
import { Platform } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PlatformRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformsByName(name?: string): Promise<Platform[]> {
    return this.prisma.platform.findMany({
      ...(name && {
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      }),
    })
  }
}
