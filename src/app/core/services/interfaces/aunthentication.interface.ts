import { Observable } from "rxjs";

export interface IAuthentication{
    sigIn(authPayload:any):Observable<any>
    signUp(registerPayload:any):Observable<any>
    signOut():Observable<any>
    me():Observable<any>
}