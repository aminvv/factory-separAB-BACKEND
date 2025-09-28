import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function swaggerConfigInit(app:INestApplication){
    const document= new DocumentBuilder()
    .setTitle('factory bitumen')
    .setDescription("API documentation for the Factory bitumen Project ")
    .setVersion('v0.0.1')
    .addBearerAuth(swaggerAuthConfig(),"Authorization")
    .build()

    const swaggerDocument=SwaggerModule.createDocument(app,document)
    SwaggerModule.setup('/swagger',app,swaggerDocument) 
}

function swaggerAuthConfig():SecuritySchemeObject{
    return{
        type:"http",
        bearerFormat:"JWT",
        in:"header",
        scheme:"bearer"
    }

}