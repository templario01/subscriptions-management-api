import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { CronExpression } from '@nestjs/schedule/dist'
import { BillingStatus } from '@prisma/client'
import { DateTime } from 'luxon'
import { PrismaService } from '../persistence/services/prisma.service'
import { BodyMailCustomerNotification } from '../shared/mail/dtos/body-mail-customer-notification.dto'
import { MailService } from '../shared/mail/mailer.service'

@Injectable()
export class CustomerJobService {
  private readonly logger: Logger
  constructor(private readonly prisma: PrismaService, private mailService: MailService) {
    this.logger = new Logger(CustomerJobService.name)
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async notifyCustomers(): Promise<void> {
    try {
      const startTime = new Date().getTime()
      const billings = await this.getBillings()
      this.logger.log(`Task for notify customers started with ${billings.length} billings`)

      if (billings.length === 0) {
        const durationTime = (new Date().getTime() - startTime) / 1000
        this.logger.log(`Task for notify customers finished with duration time ${durationTime} sec`)
        return
      }

      const customerNotificationTask = billings.map(async (data) => {
        const platforms = data.billingDetails
          .flatMap((detail) => detail.costumerPackage)
          .flatMap((customerPackage) => customerPackage.subscriptions)
          .flatMap((subscription) => subscription.suscriptionAccount)
          .map((subscriptionAccount) => subscriptionAccount.platform)

        const mailBody: BodyMailCustomerNotification = {
          email: data?.customer?.email,
          firstname: data?.customer?.userInfo?.firstName,
          phone: data?.customer?.phone,
          totalPrice: data.totalAmount.toNumber(),
          platforms: [...platforms],
        }

        await this.mailService.sendUserConfirmation(mailBody)
      })
      const durationTime = (startTime - new Date().getTime()) / 1000
      this.logger.log(`Task for notify customers finished with duration time ${durationTime} sec`)
      await Promise.all(customerNotificationTask)
    } catch (error) {
      this.logger.error(error)
    }
  }

  async getBillings() {
    const date = new Date()
    const startDate = new Date(DateTime.fromJSDate(date).toFormat(`yyyy-MM-dd 00:00.000`))
    const endDate = new Date(DateTime.fromJSDate(date).toFormat(`yyyy-MM-dd 23:59.000`))
    return this.prisma.billing.findMany({
      where: {
        status: { equals: BillingStatus.PENDING },
        createdAt: {
          gt: startDate,
          lt: endDate,
        },
        customer: {
          email: { not: null },
        },
      },
      include: {
        customer: { include: { userInfo: true } },
        billingDetails: {
          include: {
            costumerPackage: {
              include: {
                subscriptions: {
                  include: {
                    suscriptionAccount: {
                      include: { platform: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  }
}
