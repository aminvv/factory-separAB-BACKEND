import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { AuthModule } from 'src/module/auth/auth.module';
import { TokenUtils } from 'src/module/auth/utils/token.utils';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    TokenUtils
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected');
    } else {
      console.log('❌ Database not connected');
    }
  }
}
