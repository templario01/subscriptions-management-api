import { CreateCustomerSubscriptionInput } from '../dtos/inputs/create-customer-subscription.input'
import { SubscriptionModel } from '../dtos/models/subscription.model'

export abstract class ICustomerSubscriptionService {
  abstract createCustomerSubscription(input: CreateCustomerSubscriptionInput): Promise<SubscriptionModel[]>
}
