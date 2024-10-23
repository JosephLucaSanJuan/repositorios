import { Inject, Injectable } from "@angular/core";
import { Model } from "../../models/base.model";
import { IBaseRepository } from "../intefaces/base-repository.interface";
import { map, Observable } from "rxjs";
import { Paginated } from "../../models/paginated.model";
import { HttpClient } from "@angular/common/http";
import { API_URL_TOKEN, REPOSITORY_MAPPING_TOKEN, RESOURCE_NAME_TOKEN } from "../repository.tokens";
import { IBaseMapping } from "../intefaces/base-mapping.interface";

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
export class JSONServerRepositoryService<T extends Model> implements IBaseRepository<T> {

    constructor(
        protected http: HttpClient,
        @Inject(API_URL_TOKEN) protected apiUrl:string,
        @Inject(RESOURCE_NAME_TOKEN) protected resource: string,
        @Inject(REPOSITORY_MAPPING_TOKEN) protected mappingRepository: IBaseMapping<T>
    ){}

    getAll(page: number, pageSize: number): Observable<Paginated<T>> {
        return this.http.get<PaginatedRaw<T>>(
            `${this.apiUrl}/${this.resource}/?_page=${page}&_per_page=${pageSize}`)
            .pipe(map(res=>this.mappingRepository.getPaginated(page, pageSize, 0, res))
        );
    }
    getById(id: string): Observable<T | null> {
        throw new Error("Method not implemented.");
    }
    add(entity: T): Observable<T> {
        throw new Error("Method not implemented.");
    }
    update(id: string, entity: T): Observable<T> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Observable<T> {
        throw new Error("Method not implemented.");
    }

}