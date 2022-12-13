import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { BodyMailCustomerNotification } from './dtos/body-mail-customer-notification.dto'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(data: BodyMailCustomerNotification) {
    const url = `example.com/auth/confirm?token=${'121243'}`

    await this.mailerService.sendMail({
      to: 'melissavillegas251@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: 'victor',
        url,
      },
    })
  }
}
