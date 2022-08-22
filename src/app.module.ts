import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { ApiModule } from './api/api.module'
import { EnvConfigModule } from './config/env-config.module'

@Module({
  imports: [
    EnvConfigModule,
    ApiModule,
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
