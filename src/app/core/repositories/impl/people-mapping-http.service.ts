import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

export interface PersonRaw {
    id: string, 
    nombre: string,
    apellidos: string,
    edad:string,
    email: string,
    genero: string,
    grupoID: string
}
@Injectable({
    providedIn: 'root'
})
export class PeopleHttpMapping implements IBaseMapping<Person> {
    toGenderMapping:any = {
        male:'Masculino',
        female:'Femenino',
        other:'Otros'
    }

    fromGenderMapping:any = {
        Masculino:'male',
        Femenino:'female',
        Otros:'other'
    }

    setAdd(data: Person):PersonRaw {
        return {
            id:data.id, 
            nombre:data.name, 
            apellidos:data.surname, 
            edad:data.age?.toString()??'',
            email:data.email??'',
            grupoID:'',
            genero:this.toGenderMapping[data.gender],
        };
    }

    setUpdate(data:Person):PersonRaw{
        let toReturn:any = {}
        Object.keys(data).forEach(key=>{
            switch (key) {
                case 'name':
                    toReturn['nombre']=data[key]
                    break;
                case 'surname':
                    toReturn['apellidos']=data[key]
                    break;
                case 'age':
                    toReturn['edad']=data[key]
                    break;
                case 'email':
                    toReturn['email']=data[key]
                    break;
                case 'gender':
                    toReturn['genero']=data[key]
                    break;
                case 'name':
                    toReturn['grupoID']=data[key]
                    break;
                default:
                    break;
            }
        })
        return toReturn
    }

    getPaginated(page:number, pageSize: number, pages:number, data:PersonRaw[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:PersonRaw)=>{
            return this.getOne(d);
        })};
    }

    getOne(data: PersonRaw):Person {
        return {
            id:data.id, 
            name:data.nombre, 
            surname:data.apellidos, 
            age:(data as any)["edad"]??0,
            email:(data as any)["email"]??'',
            groupID:(data as any)["groupID"]??'',
            gender:this.fromGenderMapping[data.genero],
            picture:{
                large:(data as any)["picture"].large, 
                thumbnail:(data as any)["picture"].thumbnail
            }};
    }

    getAdded(data: PersonRaw):Person {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: PersonRaw):Person {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: PersonRaw):Person {
        throw new Error("Method not implemented.");
    }
}
  