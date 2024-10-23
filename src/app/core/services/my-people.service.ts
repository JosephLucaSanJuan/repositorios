import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Paginated } from "../models/paginated.model";
import { Person } from "../models/person.model";
import { PaginatedRaw } from "../repositories/impl/json-server-repository.service";
import { PersonRaw } from "../repositories/impl/people-mapping-http.service";

@Injectable({
    providedIn: 'root'
})
export class MyPeopleService{
    private apiURL:string = "http://localhost:3000/personas"
    constructor(
        private http:HttpClient
    ) {}

    getAll(page:number, pageSize:number): Observable<Paginated<Person>>{
        return this.http.get<PaginatedRaw<PersonRaw>>(`${this.apiURL}/?_page=${page}&_per_pages=${pageSize}`).pipe(map(res=>{
            return {page:page, pageSize:pageSize, pages:res.pages, data:res.data.map<Person>((d:PersonRaw)=>{
                return {
                    id:d.id,
                    name:d.nombre,
                    surname:d.apellidos,
                    age:(d as any)["age"]??0,
                    picture:(d as any)["picture"]?{
                        large:(d as any)["picture"].large,
                        thumbnail:(d as any)["picture"].thumbnail
                    }:undefined
                }
            })}
        }))
    }/**/
}