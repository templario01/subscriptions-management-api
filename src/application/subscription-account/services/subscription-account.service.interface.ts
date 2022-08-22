import { Injectable } from '@nestjs/common'
import { CreateSubscriptionAccountInput } from '../dtos/inputs/create-subscription-account.input'
import { SubscriptionAccountModel } from '../dtos/models/subscription-account.model'

@Injectable()
export abstract class ISubscriptionAccountService {
  abstract createSubscriptionAccount(input: CreateSubscriptionAccountInput): Promise<SubscriptionAccountModel>
}
