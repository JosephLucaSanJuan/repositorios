import { Login, Register, User } from "../../models/user.model"

export interface IAuthMapping{
    signInPayload(login:Login):any
    signUpPayload(register:Register):any
    signIn(response:any):User
    signUp(response:any):User
    me(response:any):User
}