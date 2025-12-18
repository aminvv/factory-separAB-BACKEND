import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpServer, Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';


@Injectable()
export class ZarinnpalService {
  constructor(
    private httpService: HttpService,

  ) { }

  async sendRequest(data?: any) {
    const { amount, description, user } = data
    const option = {
      merchant_id: process.env.ZARINNPAL_MERCHANT_ID,
      amount: amount,
      description,
      metadata: {
        email: user?.email ?? "",
        mobile: user?.mobile ?? ""
      },
      callback_url: "http://localhost:3000/payment/verify"
    }
    const result = await lastValueFrom(
      this.httpService.post(process.env.ZARINNPAL_REQUEST_URL, option)
        .pipe(map(res => res.data))
        .pipe(catchError(err => {
          console.log(err);

          throw new InternalServerErrorException("zarinnpal error")
        }))
    )
    const { authority, code } = result.data
    if (code == 100 && authority) {
      return {
        code,
        authority,
        gateWayUrl: `${process.env.ZARINNPAL_GATEWAY_URL}/${authority}`
      }
    }
    throw new BadRequestException("connection failed in zarinnpal")
  }

  async verifyRequest(data?: any) {
    const option = {
      authority: data.authority,
      merchant_id: data.merchant_id,
      amount: data.amount,

    }
    const result = await lastValueFrom(

      this.httpService.post(process.env.ZARINNPAL_VERIFY_URL, option)
        .pipe(map((res) => res.data))
        .pipe(catchError(err => {
          throw new InternalServerErrorException("zarinnpal error")
        }))
    )
    return result
  }
}
