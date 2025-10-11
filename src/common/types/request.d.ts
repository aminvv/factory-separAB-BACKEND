import { UserEntity } from "src/module/user/entities/user.entity";

 declare namespace Express{
    interface Request{
        user:UserEntity
    }
 }