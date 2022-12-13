import { Module } from '@nestjs/common'
import { PrismaService } from '../persistence/services/prisma.service'
import { MailModule } from '../shared/mail/mailer.module'
import { CustomerJobService } from './custumer.job.service'

const cronJobs = [PrismaService, CustomerJobService]

@Module({
  imports: [MailModule],
  providers: [...cronJobs],
  exports: [...cronJobs],
})
export class JobsModule {}
