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
    fromGenderMapping:any = {
        male:'Masculino',
        female:'Femenino',
        other:'Otros'
    }

    toGenderMapping:any = {
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
            genero:this.toGenderMapping[data.gender],
            grupoID:data.groupID??'',
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
                    toReturn['genero']=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other'
                    break;
                case 'groupID':
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
            picture:(data as any)["picture"]?{
                url:(data as any)["picture"].url, 
                large:(data as any)["picture"].large, 
                medium:(data as any)["picture"].medium,
                small:(data as any)["picture"].small,
                thumbnail:(data as any)["picture"].thumbnail
            }:undefined};
    }

    getAdded(data: PersonRaw):Person {
        return this.getOne(data);
    }
    getUpdated(data: PersonRaw):Person {
        return this.getOne(data);
    }
    getDeleted(data: PersonRaw):Person {
        return this.getOne(data);
    }
}
  