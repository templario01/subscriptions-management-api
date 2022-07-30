import { registerAs } from '@nestjs/config'

export interface IAppConfig {
  environment: string
  port: number
}

export const appConfig = registerAs<IAppConfig>(
  'appConfig',
  (): IAppConfig => ({
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT) || 3000,
  }),
)

export interface IJwtConfig {
  jwtSecretKey: string
}

export const jwtConfig = registerAs<IJwtConfig>(
  'jwtConfig',
  (): IJwtConfig => ({
    jwtSecretKey: process.env.JWT_SECRET_KEY,
  }),
)
