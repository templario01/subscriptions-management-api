import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { SubscriptionAccountRepository } from '../../../persistence/repositories/subscription-account.repository'
import { CreateSubscriptionAccountInput } from '../dtos/inputs/create-subscription-account.input'
import { SubscriptionAccountModel } from '../dtos/models/subscription-account.model'
import { ISubscriptionAccountService } from './subscription-account.service.interface'

@Injectable()
export class SubscriptionAccountService implements ISubscriptionAccountService {
  constructor(private readonly subscriptionAccountRepo: SubscriptionAccountRepository) {}

  async createSubscriptionAccount(input: CreateSubscriptionAccountInput): Promise<SubscriptionAccountModel> {
    const subscriptionAccount = await this.subscriptionAccountRepo.createSubscriptionAccount(input)

    return plainToClass(SubscriptionAccountModel, subscriptionAccount)
  }

  async getSubscriptionAccountsByPlatform(platformUUID: string): Promise<SubscriptionAccountModel[]> {
    const subscriptionAccounts = await this.subscriptionAccountRepo.getSubscriptionAccounstByPlatform(platformUUID)

    return subscriptionAccounts.map(({ platform, ...subscriptionAccount }) => {
      return plainToClass(SubscriptionAccountModel, {
        ...subscriptionAccount,
        platform: {
          ...platform,
          defaultPrice: platform.defaultPrice.toNumber(),
        },
      })
    })
  }
}
