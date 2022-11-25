import { Injectable } from '@nestjs/common'
import { GetSubscriptionAccount } from '../dtos/args/get-subscription-account.args'
import { CreateSubscriptionAccountInput } from '../dtos/inputs/create-subscription-account.input'
import { IPaginatedSubscriptionAccountModel, SubscriptionAccountModel } from '../dtos/models/subscription-account.model'

@Injectable()
export abstract class ISubscriptionAccountService {
  abstract createSubscriptionAccount(
    input: CreateSubscriptionAccountInput,
    id: number,
  ): Promise<SubscriptionAccountModel>
  abstract getSubscriptionAccountsByPlatform(platformUUID: string): Promise<SubscriptionAccountModel[]>
  abstract getAllAccountsWithFilter(
    params: GetSubscriptionAccount,
    userId: number,
  ): Promise<IPaginatedSubscriptionAccountModel>
}
