import { SessionData } from '@application/auth/dtos/response/auth.response'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { RolesEnum } from '../../application/common/roles.enum'
import { GetSubscriptionAccountParams } from '../../application/subscription-account/dtos/args/get-subscription-account.args'
import { CreateSubscriptionAccountInput } from '../../application/subscription-account/dtos/inputs/create-subscription-account.input'
import {
  PaginatedSubscriptionAccountModel,
  SubscriptionAccountModel,
} from '../../application/subscription-account/dtos/models/subscription-account.model'
import { ISubscriptionAccountService } from '../../application/subscription-account/services/subscription-account.service.interface'
import { CurrentUser } from '../decorators/current-user.decorator'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver()
export class SubscriptionAccountResolver {
  constructor(private readonly subscriptionAccountService: ISubscriptionAccountService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Mutation(() => SubscriptionAccountModel, { name: 'createSubscriptionAccount' })
  createSubscriptionAccount(
    @CurrentUser() { id }: SessionData,
    @Args('data') params: CreateSubscriptionAccountInput,
  ): Promise<SubscriptionAccountModel> {
    return this.subscriptionAccountService.createSubscriptionAccount(params, id)
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => [SubscriptionAccountModel], { name: 'getSubscriptionAccounsByPlatform' })
  getSubscriptonAccountsByPlatform(@Args('platformUUID') platformUUID: string): Promise<SubscriptionAccountModel[]> {
    return this.subscriptionAccountService.getSubscriptionAccountsByPlatform(platformUUID)
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Query(() => PaginatedSubscriptionAccountModel, { name: 'getAllSubscriptionAccounts' })
  getAllSubscriptionAccounts(
    @CurrentUser() { id }: SessionData,
    @Args('') params: GetSubscriptionAccountParams,
  ): Promise<PaginatedSubscriptionAccountModel> {
    return this.subscriptionAccountService.getAllAccountsWithFilter(params, id)
  }
}
