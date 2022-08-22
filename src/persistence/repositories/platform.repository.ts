import { Injectable } from '@nestjs/common'
import { Platform } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class PlatformRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPlatforms(): Promise<Platform[]> {
    return this.prisma.platform.findMany()
  }
}
