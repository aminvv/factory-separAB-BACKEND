import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
        ConfigModule.forRoot({
      isGlobal: true,       
      envFilePath: '.env',  
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected');
    } else {
      console.log('❌ Database not connected');
    }
  }
}
