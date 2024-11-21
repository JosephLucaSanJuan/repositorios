import { Inject, Injectable } from "@angular/core";
import { BaseAuthenticationService } from "./base-authentication.service";
import { Observable, filter, of, switchMap, take, tap } from "rxjs";
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN } from "../../repositories/repository.tokens";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { HttpClient } from "@angular/common/http";
import { StrapiLoginResponse, StrapiRegisterResponse } from "./strapi-auth-mapping.service";

@Injectable({
    providedIn: 'root'
})
export class StrapiAuthenticationService extends BaseAuthenticationService {
    private jwt_token:string|null=null

    constructor(
        @Inject(AUTH_SIGN_IN_API_URL_TOKEN) protected signInUrl:string,
        @Inject(AUTH_SIGN_UP_API_URL_TOKEN) protected signUpUrl:string,
        @Inject(AUTH_ME_API_URL_TOKEN) protected meUrl:string,
        @Inject(AUTH_MAPPING_TOKEN) authMapping:IAuthMapping,
        private httpClient:HttpClient
    ){
        super(authMapping);
        this.jwt_token = localStorage.getItem('people-jwt-token')
        if (this.jwt_token) {
            this.me().subscribe({
                next:(response) => {
                    this._authenticated.next(true)
                    this._users.next(this.authMapping.me(response))
                },
                error:(err) => {
                    this._authenticated.next(false)
                    this._users.next(undefined)
                },
                complete:() => {
                    this._ready.next(true)
                },
            })
        } else {
            this._ready.next(true)
        }
    }

    sigIn(authPayload: any): Observable<any> {
        return this.httpClient.post<StrapiLoginResponse>(
            `${this.signInUrl}`,
            this.authMapping.signInPayload(authPayload)
        ).pipe(tap(resp=>{
            localStorage.setItem("people-jwt-token",resp.jwt)
            this._authenticated.next(true)
            this._users.next(this.authMapping.signIn(resp))
        }));
    }

    signUp(registerPayload: any): Observable<any> {
        return this.httpClient.post<StrapiRegisterResponse>(
            `${this.signUpUrl}`,
            this.authMapping.signUpPayload(registerPayload)
        ).pipe(tap(resp=>{
            localStorage.setItem("people-jwt-token",resp.jwt)
            this._authenticated.next(true)
            this._users.next(this.authMapping.signUp(resp))
        }));
    }

    signOut(): Observable<any> {
        return of(true).pipe(tap(_=>{
            localStorage.removeItem('poepl-jwt-token')
            this._authenticated.next(false)
            this._users.next(undefined)
        }));
    }

    me(): Observable<any> {
        return this.httpClient.get<StrapiRegisterResponse>(
            `${this.meUrl}`,{headers:{Autorization: `Bearer ${this.jwt_token}`}}
        );
    }

    override getCurrent(): Promise<any> {
        return new Promise((resolve) => {
            this._ready.pipe(
                filter(ready => ready === true),
                take(1),
                switchMap(() => this._users.pipe(take(1)))
            ).subscribe(user => {
                resolve(user)
            })
        });
    }
}