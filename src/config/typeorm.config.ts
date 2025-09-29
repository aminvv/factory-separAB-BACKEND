
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import path, { join } from "path";


export function TypeOrmConfig(): TypeOrmModuleOptions {
    const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, } = process.env

    return {
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        autoLoadEntities: true,
        entities: [join(__dirname, "../module/**/entities/*.entity{.ts,.js}")],
        synchronize: true,
        type: 'postgres',
    }
}
