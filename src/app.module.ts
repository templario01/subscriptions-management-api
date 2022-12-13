import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'
import { join } from 'path'
import { ApiModule } from './api/api.module'
import { EnvConfigModule } from './config/env-config.module'
import { JobsModule } from './jobs/jobs.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvConfigModule,
    ApiModule,
    JobsModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      sortSchema: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res, payload, connection }) => ({ req, res, payload, connection }),
      playground: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
