import { PlatformModel } from '../dtos/models/platform.model'

export abstract class IPlatformService {
  abstract getPlatforms(userId: number, name?: string): Promise<PlatformModel[]>
  abstract getManagedPlatforms(userId: number): Promise<PlatformModel[]>
}
