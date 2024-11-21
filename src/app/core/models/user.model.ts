export interface Login{
    email:string,
    password:string
}

export interface Register{
    name:string,
    surname:string,
    birthDate:string,
    gender:string,
    user:string,
    group:string,
    email:string,
    password:string
}

export interface User{
    id:string,
    username:string,
    email:string
}