import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paginated } from "../models/paginated.model";
import { Person } from "../models/person.model";
import { PaginatedRaw } from "../repositories/impl/people-mapping-http.service";

@Injectable({
    providedIn: 'root'
})
export class MyPeopleService{
    private apiURL:string = "http://localhost:3000/personas"
    constructor(
        private http:HttpClient
    ) {}

    /*getAll(page:number, pageSize:number): Observable<Paginated<Person>>{
        return this.http.get<PaginatedRaw<Person>>
    }*/
}