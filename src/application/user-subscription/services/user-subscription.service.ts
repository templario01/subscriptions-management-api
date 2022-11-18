import { Injectable } from '@nestjs/common'
import { SubscriptionAccountRepository } from '../../../persistence/repositories/subscription-account.repository'
import { UserSubscriptionRepository } from '../../../persistence/repositories/user-subscription'

@Injectable()
export class SubscriptionAccountService {
  constructor(
    private readonly userSubscriptionRepository: UserSubscriptionRepository,
    private readonly subscriptionAccontRepository: SubscriptionAccountRepository,
  ) {}
}
