import { Injectable } from "@angular/core"
import { IAuthMapping } from "../interfaces/auth-mapping.interface"
import { Login, Register, User } from "../../models/user.model"

export interface StrapiMeResponse {
    id:number,
    username:string
    email:string,
    provider:string,
    confirmed:boolean,
    blocked:boolean,
    createdAt:string,
    updatedAt:string
}

export interface StrapiLoginResponse{
    jwt:string,
    user:StrapiUser
}

export interface StrapiRegisterResponse{
    jwt:string,
    user:StrapiUser
}

export interface StrapiUser {
    id:number,
    username:string
    email:string,
    provider:string,
    confirmed:boolean,
    blocked:boolean,
    createdAt:string,
    updatedAt:string
}

export interface StrapiLogin{
    identifier:string,
    password:string
}

export interface StrapiRegister{
    email:string,
    password:string,
    username:string
}

export interface GroupRaw{
    id:string,
    nombre:string
}

@Injectable({
    providedIn: 'root'
})
export class StrapiAuthMappingService implements IAuthMapping {
    signInPayload(login: Login):StrapiLogin {
        return {
            identifier:login.email,
            password:login.password
        }
    }
    signUpPayload(register: Register):StrapiRegister {
        return {
            email:register.email,
            password:register.password,
            username:register.name+" "+register.surname
        }
    }
    signIn(response: StrapiLoginResponse): User {
        return {
            id:response.user.id.toString(),
            username:response.user.username,
            email:response.user.email
        }
    }
    signUp(response: StrapiRegisterResponse): User {
        return {
            id:response.user.id.toString(),
            username:response.user.username,
            email:response.user.email
        }
    }
    me(response: StrapiMeResponse): User {
        return {
            id:response.id.toString(),
            username:response.username,
            email:response.email
        }
    }
}