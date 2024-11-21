import { Injectable } from "@angular/core";
import { IAuthentication } from "../interfaces/aunthentication.interface";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../../models/user.model";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";

@Injectable({
    providedIn: 'root'
})
export abstract class BaseAuthenticationService implements IAuthentication/**/ {
    protected _authenticated:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    public authenticated$:Observable<boolean> = this._authenticated.asObservable()

    protected _users:BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined)
    public users$:Observable<User | undefined> = this._users.asObservable()

    protected _ready:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    public ready$:Observable<boolean> = this._ready.asObservable()

    constructor(protected authMapping:IAuthMapping){}

    abstract getCurrent(): Promise<any>
    abstract sigIn(authPayload: any): Observable<any>
    abstract signUp(registerPayload: any): Observable<any>
    abstract signOut(): Observable<any>
    abstract me(): Observable<any>
}