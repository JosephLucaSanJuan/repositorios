import { Injectable } from "@angular/core"
import { Group } from "../models/group.model"
import { GroupRaw } from "../repositories/impl/group-mapping-json-server.service"
import { HttpClient } from "@angular/common/http"
import { map, Observable } from "rxjs"
import { Paginated } from "../models/paginated.model"
import { PaginatedRaw } from "../repositories/impl/json-server-repository.service"

@Injectable({
    providedIn: 'root'
})
export class MyPeopleService{
    private apiURL:string = "http://localhost:3000/grupos"
    constructor(
        private http:HttpClient
    ) {}

    getAll(page:number, pageSize:number): Observable<Paginated<Group>>{
        return this.http.get<PaginatedRaw<GroupRaw>>(`${this.apiURL}/?_page=${page}&_per_pages=${pageSize}`).pipe(map(res=>{
            return {page:page, pageSize:pageSize, pages:res.pages, data:res.data.map<Group>((d:GroupRaw)=>{
                return {
                    id:d.id,
                    name:d.name
                }
            })}
        }))
    }/**/
}