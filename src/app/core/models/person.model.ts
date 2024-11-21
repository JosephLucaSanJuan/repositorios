// src/app/core/person.model.ts
import { Model } from "./base.model";

export interface Person extends Model{
    name:string,
    surname:string,
    age?:number,
    email?:string,
    gender:string,
    picture?:{
        url:string// | undefined,
        large:string,
        medium:string,
        small:string,
        thumbnail:string
    },
    groupID?:string
    userID?:string
}