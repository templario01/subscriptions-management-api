import { Platform } from '@prisma/client'

export interface BodyMailCustomerNotification {
  firstname?: string
  email: string
  phone: string
  totalPrice: number
  platforms: Platform[]
}
