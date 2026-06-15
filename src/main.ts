import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { swaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useStaticAssets("public")


  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});
  swaggerConfigInit(app)
  const { PORT } = process.env
  await app.listen(PORT, () => {

    console.log(`run serve is port ${PORT} :::: http://localhost:${PORT}`);
    console.log(`run swagger is port :::: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
