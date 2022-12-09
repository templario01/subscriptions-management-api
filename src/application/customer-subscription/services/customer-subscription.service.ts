import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CustomerSubscriptionRepository } from '../../../persistence/repositories/customer-subscription.repository'
import { SubscriptionAccountModel } from '../../subscription-account/dtos/models/subscription-account.model'
import { CreateCustomerSubscriptionInput } from '../dtos/inputs/create-customer-subscription.input'
import { SubscriptionModel } from '../dtos/models/subscription.model'
import { ICustomerSubscriptionService } from './customer-subscription.service.interface'

@Injectable()
export class CustomerSubscriptionService implements ICustomerSubscriptionService {
  constructor(private readonly userSubscriptionRepository: CustomerSubscriptionRepository) {}

  async createCustomerSubscription(input: CreateCustomerSubscriptionInput): Promise<SubscriptionModel[]> {
    const subscriptions = await this.userSubscriptionRepository.creatSubscriptions(input)

    const response = subscriptions.map((subscription) => {
      const accounts = subscription.suscriptionAccount.map((account) => {
        return plainToInstance(SubscriptionAccountModel, {
          ...account,
          completePrice: account.completePrice.toNumber(),
          slotPrice: account.slotPrice.toNumber(),
        })
      })

      return plainToInstance(SubscriptionModel, {
        ...subscription,
        customPrice: subscription.customPrice.toNumber(),
        suscriptionAccount: accounts,
      })
    })

    return response
  }
}
