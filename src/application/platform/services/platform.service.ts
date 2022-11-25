import { Injectable } from '@nestjs/common'
import { PlatformRepository } from '@persistence/repositories/platform.repository'
import { PlatformModel } from '../dtos/models/platform.model'
import { IPlatformService } from './platform.service.interface'

@Injectable()
export class PlatformService implements IPlatformService {
  constructor(private readonly platformRepo: PlatformRepository) {}

  async getPlatforms(): Promise<PlatformModel[]> {
    return this.platformRepo.getPlatformsByName()
  }

  async getManagedPlatforms(userId: number): Promise<PlatformModel[]> {
    return this.platformRepo.getManagedPlatforms(userId)
  }
}
