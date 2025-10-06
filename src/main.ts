import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: 'http://localhost:4200', 
    credentials: true
  });
  swaggerConfigInit(app)
  const {PORT}=process.env
  await app.listen(PORT,()=>{

    console.log(`run serve is port ${PORT} :::: http://localhost:${PORT}` );
    console.log(`run swagger is port :::: http://localhost:${PORT}/swagger` );
  });
}
bootstrap();
