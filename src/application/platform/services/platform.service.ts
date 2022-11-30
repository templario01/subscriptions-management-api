import { Injectable } from '@nestjs/common'
import { PlatformRepository } from '@persistence/repositories/platform.repository'
import { PlatformModel } from '../dtos/models/platform.model'
import { IPlatformService } from './platform.service.interface'

@Injectable()
export class PlatformService implements IPlatformService {
  constructor(private readonly platformRepo: PlatformRepository) {}

  async getPlatforms(userId: number, name?: string): Promise<PlatformModel[]> {
    return this.platformRepo.getPlatformsByName(userId, name)
  }

  async getManagedPlatforms(userId: number): Promise<PlatformModel[]> {
    return this.platformRepo.getManagedPlatforms(userId)
  }
}
