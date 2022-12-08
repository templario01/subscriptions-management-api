import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { RolesEnum } from '../../application/common/roles.enum'
import { CreateCustomerSubscriptionInput } from '../../application/customer-subscription/dtos/inputs/create-customer-subscription.input'
import { SubscriptionModel } from '../../application/customer-subscription/dtos/models/subscription.model'
import { ICustomerSubscriptionService } from '../../application/customer-subscription/services/customer-subscription.service.interface'
import { Roles } from '../decorators/role.decorator'
import { GqlJwtAuthGuard } from '../guards/jwt-auth.guard'
import { RoleGuard } from '../guards/role.guard'

@Resolver()
export class CustomerSubscriptionResolver {
  constructor(private readonly subscriptionAccountService: ICustomerSubscriptionService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(GqlJwtAuthGuard, RoleGuard)
  @Mutation(() => [SubscriptionModel], { name: 'createCustomerSubscriptions' })
  createCustomerSubscriptions(@Args('data') params: CreateCustomerSubscriptionInput): Promise<SubscriptionModel[]> {
    return this.subscriptionAccountService.createCustomerSubscription(params)
  }
}
