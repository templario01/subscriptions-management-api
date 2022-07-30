import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { ApiModule } from './api/api.module'
import { EnvConfigModule } from './api/config/env-config.module'

@Module({
  imports: [
    EnvConfigModule,
    ApiModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      sortSchema: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      context: ({ req }) => ({ req }),
      playground: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
