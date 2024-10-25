import { Inject, Injectable } from "@angular/core";
import { Model } from "../../models/base.model";
import { IBaseRepository } from "../intefaces/base-repository.interface";
import { map, Observable } from "rxjs";
import { Paginated } from "../../models/paginated.model";
import { HttpClient } from "@angular/common/http";
import { API_URL_TOKEN, REPOSITORY_MAPPING_TOKEN, RESOURCE_NAME_TOKEN } from "../repository.tokens";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { BaseRepositoryHttpService } from "./base-repository-http.service";

export interface PaginatedRaw<T> {
  first: number
  prev: number|null
  next: number|null
  last: number
  pages: number
  items: number
  data: T[]
};

@Injectable({
    providedIn: 'root'
})
export class JSONServerRepositoryService<T extends Model> extends BaseRepositoryHttpService<T> {

    constructor(
        protected override http: HttpClient,
        @Inject(API_URL_TOKEN) protected override apiUrl:string,
        @Inject(RESOURCE_NAME_TOKEN) protected override resource: string,
        @Inject(REPOSITORY_MAPPING_TOKEN) protected mappingRepository: IBaseMapping<T>
    ){
        super(http, apiUrl, resource, mappingRepository)
    }

    override getAll(page: number, pageSize: number): Observable<Paginated<T>|T[]> {
        if (page!=-1) {
            return this.http.get<PaginatedRaw<T>>(
                `${this.apiUrl}/${this.resource}/?_page=${page}&_per_page=${pageSize}`)
                .pipe(map(res=>this.mappingRepository.getPaginated(page, pageSize, res.pages, res.data))
            );
        } else {
            return this.http.get<T[]>(
                `${this.apiUrl}/${this.resource}/?_page=${page}&_per_page=${pageSize}`)
                .pipe(map(res=>res.map((element:any)=>
                    this.mappingRepository.getOne(element)
                ))
            );
        }
    }

    override getById(id: string): Observable<T | null> {
        throw new Error("Method not implemented.");
    }

    override add(entity: T): Observable<T> {
        return this.http.post<T>(
            `${this.apiUrl}/${this.resource}`, this.mappingRepository.setAdd(entity))
            .pipe(map(res=>this.mappingRepository.getAdded(res))
        );
    }

    override update(id: string, entity: T): Observable<T> {
        return this.http.patch<T>(
            `${this.apiUrl}/${this.resource}/${id}`, this.mappingRepository.setUpdate(entity))
            .pipe(map(res=>this.mappingRepository.getUpdated(res))
        );
    }

    override delete(id: string): Observable<T> {
        throw new Error("Method not implemented.");
    }

}