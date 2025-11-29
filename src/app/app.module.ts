import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { AuthModule } from 'src/module/auth/auth.module';
import { BlogModule } from 'src/module/blog/blog.module';
import { ProductModule } from 'src/module/product/product.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    ProductModule,
    BlogModule
  ],
  providers: [ CloudinaryService],
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
