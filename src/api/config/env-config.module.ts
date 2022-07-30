import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvConfigService } from './env-config.service'
import { appConfig, jwtConfig } from './app.config'

const configuration = [appConfig, jwtConfig]

@Global()
@Module({
  providers: [EnvConfigService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configuration],
      cache: true,
    }),
  ],
  exports: [EnvConfigService],
})
export class EnvConfigModule {}
