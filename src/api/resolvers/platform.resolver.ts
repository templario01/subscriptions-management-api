import { SessionData } from '@application/auth/dtos/response/auth.response'
import { RolesEnum } from '@application/common/roles.enum'
import { PlatformModel } from '@application/platform/dtos/models/platform.model'
import { IPlatformService } from '@application/platform/services/platform.service.interface'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver()
export class PlatformResolver {
  constructor(private readonly platformService: IPlatformService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => [PlatformModel], { name: 'getAllPlatforms' })
  getAllPlatforms(): Promise<PlatformModel[]> {
    return this.platformService.getPlatforms()
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => [PlatformModel], { name: 'getManagedPlatforms' })
  getManagedPlatforms(@CurrentUser() { id }: SessionData): Promise<PlatformModel[]> {
    return this.platformService.getManagedPlatforms(id)
  }
}
