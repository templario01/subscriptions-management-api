import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { plainToClass, plainToInstance } from 'class-transformer'

import { SubscriptionAccountRepository } from '../../../persistence/repositories/subscription-account.repository'
import { CreateSubscriptionAccountInput } from '../dtos/inputs/create-subscription-account.input'
import { GetSubscriptionAccount } from '../dtos/args/get-subscription-account.args'
import { IPaginatedSubscriptionAccountModel, SubscriptionAccountModel } from '../dtos/models/subscription-account.model'
import { ISubscriptionAccountService } from './subscription-account.service.interface'

@Injectable()
export class SubscriptionAccountService implements ISubscriptionAccountService {
  constructor(private readonly subscriptionAccountRepo: SubscriptionAccountRepository) {}

  async createSubscriptionAccount(
    input: CreateSubscriptionAccountInput,
    id: number,
  ): Promise<SubscriptionAccountModel> {
    const account = await this.subscriptionAccountRepo.createSubscriptionAccount(input, id)

    return plainToInstance(SubscriptionAccountModel, {
      ...account,
      slotPrice: account.slotPrice.toNumber(),
      completePrice: account.completePrice.toNumber(),
    })
  }

  async getSubscriptionAccountsByPlatform(platformUUID: string): Promise<SubscriptionAccountModel[]> {
    const subscriptionAccounts = await this.subscriptionAccountRepo.getSubscriptionAccounstByPlatform(platformUUID)

    return subscriptionAccounts.map(({ platform, ...subscriptionAccount }) => {
      return plainToClass(SubscriptionAccountModel, {
        ...subscriptionAccount,
        platform: {
          ...platform,
        },
      })
    })
  }

  async verifyAvailableSlots() {
    const subscriptionAccount = await this.subscriptionAccountRepo.findByUUID('123')
    if (subscriptionAccount.slots === 0) {
      throw new UnprocessableEntityException(`No slots available for account ${subscriptionAccount.email}`)
    }
  }

  async getAllAccountsWithFilter(
    params: GetSubscriptionAccount,
    userId: number,
  ): Promise<IPaginatedSubscriptionAccountModel> {
    return this.subscriptionAccountRepo.findByName(params, userId)
  }
}
