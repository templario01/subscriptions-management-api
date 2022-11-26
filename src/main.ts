import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { urlencoded, json } from 'express'

async function bootstrap() {
  const ENV = process.env.NODE_ENV || 'development'
  const PORT = process.env.APP_PORT || 3000
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () => {
    Logger.verbose(`Starting application with environment ${ENV}`, AppModule.name)
    Logger.verbose(`Starting application in port ${PORT}`, AppModule.name)
  })
}
bootstrap()
