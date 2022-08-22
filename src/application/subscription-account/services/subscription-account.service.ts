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
    try {
      const subscriptionAccount = await this.subscriptionAccountRepo.createSubscriptionAccount(input)
      return plainToClass(SubscriptionAccountModel, subscriptionAccount)
    } catch (error) {
      console.log(error)
    }
  }
}
