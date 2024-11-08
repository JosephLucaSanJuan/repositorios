import { Inject, Injectable } from "@angular/core";
import { Model } from "../../models/base.model";
import { BaseRepositoryHttpService } from "./base-repository-http.service";
import { HttpClient } from "@angular/common/http";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { API_URL_TOKEN, RESOURCE_NAME_TOKEN, REPOSITORY_MAPPING_TOKEN } from "../repository.tokens";
import { Observable, map } from "rxjs";
import { Paginated } from "../../models/paginated.model";

export interface Data<T> {
    id:number
    attributes:T
}

export interface Pagination{
    page: number
    pageSize: number
    pageCount: number
    total: number
}

export interface Meta{
    pagination: Pagination
}

export interface PaginatedRaw<T>{
    data: Data<T>[]
    meta: Meta
}

@Injectable({
    providedIn: 'root'
})
export class StrapiRepositoryService<T extends Model> extends BaseRepositoryHttpService<T> {

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
                `${this.apiUrl}/${this.resource}?pagination[page]=${page}&pagination[pageSize]=${pageSize}`)
                .pipe(map(res=>this.mappingRepository.getPaginated(page, pageSize, res.meta.pagination.total, res.data))
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
        return this.http.delete<T>(
            `${this.apiUrl}/${this.resource}/${id}`).pipe(map(res=>this.mappingRepository.getDeleted(res))
        );;
    }

}