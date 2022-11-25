import { PlatformModel } from '../dtos/models/platform.model'

export abstract class IPlatformService {
  abstract getPlatforms(): Promise<PlatformModel[]>
  abstract getManagedPlatforms(userId: number): Promise<PlatformModel[]>
}
