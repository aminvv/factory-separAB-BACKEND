import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { swaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,     
    forbidNonWhitelisted: true, 
    transform: true,    
  }));


  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });
  swaggerConfigInit(app)
  const { PORT } = process.env
  await app.listen(PORT, () => {

    console.log(`run serve is port ${PORT} :::: http://localhost:${PORT}`);
    console.log(`run swagger is port :::: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
