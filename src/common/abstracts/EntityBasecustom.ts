import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseEntityCustom{
    @PrimaryGeneratedColumn("increment")
    id:number
}