import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

export interface PersonRaw {
    id: string, 
    nombre: string,
    apellidos: string,
    email: string,
    genero: string,
    grupoID: string
}
@Injectable({
    providedIn: 'root'
})
export class PeopleHttpMapping implements IBaseMapping<Person> {
    getPaginated(page:number, pageSize: number, pages:number, data:PersonRaw[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:PersonRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: any):Person {
        return {
            id:data.id, 
            name:data.name.first, 
            surname:data.name.last, 
            age:data.age,
            picture:{
                large:data.picture.large, 
                thumbnail:data.picture.thumbnail
            }};
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
  