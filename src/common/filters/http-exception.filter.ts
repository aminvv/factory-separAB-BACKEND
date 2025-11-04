import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";
import { Request, Response } from "express";




@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()


        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR

        const errorResponse = exception instanceof HttpException
            ? exception.getResponse()
            : null



        const message =
            (errorResponse as any)?.message ||
            (exception as any)?.message || 'Internal server error';



            
        response.status(status).json({
            statusCode: status,
            message,
            error: (errorResponse as any)?.error
                || HttpStatus[status]
                || "Error",
            timestamp: new Date().toISOString(),
            path: request.url,
        })
    }
}