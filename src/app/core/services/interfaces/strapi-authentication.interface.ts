import { IAuthentication } from "./aunthentication.interface";

export interface IStrapiAuthentication extends IAuthentication {
    getToken():string | null
}