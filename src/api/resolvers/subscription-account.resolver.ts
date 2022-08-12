import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { RolesEnum } from '../../application/common/roles.enum'
import { CreateSubscriptionAccountInput } from '../../application/subscription-account/dtos/inputs/create-subscription-account.input'
import { SubscriptionAccountModel } from '../../application/subscription-account/dtos/models/subscription-account.model'
import { SubscriptionAccountService } from '../../application/subscription-account/services/subscription-account.service'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver()
export class SubscriptionAccountResolver {
  constructor(private readonly subscriptionAccountService: SubscriptionAccountService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Mutation(() => SubscriptionAccountModel, { name: 'createSubscriptionAccount' })
  createSubscriptionAccount(
    @Args('createAccountInput') params: CreateSubscriptionAccountInput,
  ): Promise<SubscriptionAccountModel> {
    return this.subscriptionAccountService.createSubscriptionAccount(params)
  }
}
