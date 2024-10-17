import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

export interface PaginatedRaw<T> {
    first: number
    prev: number|null
    next: number|null
    last: number
    pages: number
    items: number
    data: T[]
}
@Injectable({
    providedIn: 'root'
})
export class PeopleHttpMapping implements IBaseMapping<Person> {
    getPaginated(page:number, pageSize: number, pages:number, data:any): Paginated<Person> {
        throw new Error("Method not implemented.");
    }
    getOne(data: any):Person {
        throw new Error("Method not implemented.");
    }
    getAdded(data: any):Person {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any):Person {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any):Person {
        throw new Error("Method not implemented.");
    }
}
  