import { Model } from "./base.model";

export interface User extends Model{
    email:string,
    username:string,
    password:string
}