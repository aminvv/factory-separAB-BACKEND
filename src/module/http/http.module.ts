import { Global, Module } from '@nestjs/common';
import { ZarinnpalService } from './zarinnpal.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import axios from 'axios'; 
@Global()
@Module({
  imports:[HttpModule.register({maxRedirects:5,timeout:5000})],
  controllers: [],
  providers: [
    {
      provide: 'AXIOS_INSTANCE_TOKEN',
      useValue: axios.create({
        timeout: 5000,
        maxRedirects: 5,
      }),
    },
    HttpService,ZarinnpalService],
  exports: [HttpService,ZarinnpalService],
})
export class HttpApiModule {}
