import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { urlencoded, json } from 'express'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const ENV = process.env.NODE_ENV || 'development'
  const PORT = process.env.APP_PORT || 3000
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.enableCors()
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
    cookieParser(),
  )
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () => {
    Logger.verbose(`Starting application in ${ENV} environment`, AppModule.name)
    if (ENV === 'development') {
      Logger.verbose(`Server running on http://localhost:${PORT}/graphql`, AppModule.name)
    }
  })
}
bootstrap()
