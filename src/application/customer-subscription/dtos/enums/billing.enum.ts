import { registerEnumType } from '@nestjs/graphql'

export enum BillingStatusEnum {
  PAID = 'PAID',
  PENDING = 'PENDING',
}

registerEnumType(BillingStatusEnum, {
  name: 'BillingStatusEnum',
  description: 'estado de pago de servicios',
})
