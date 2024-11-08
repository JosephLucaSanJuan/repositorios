import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Person } from "../../models/person.model";
import { Paginated } from "../../models/paginated.model";

export interface GroupRaw{
    data:Data<GroupAttributes>
}

export interface GroupAttributes {
    name: string
}

export interface PersonRaw{
    data:Data<PersonAttributes>,
    meta:Meta
}

export interface PersonAttributes {
    name: string
    surname: string
    gender: string
    birthdate?: string
    createdAt?:string
    updatedAt?:string
    publishedAt?:string
    group: GroupRaw | number | null
}

export interface Data<T> {
    id:number
    attributes:PersonAttributes
}

export interface PersonData {
    attributes:PersonAttributes
}

export interface Meta{}

@Injectable({
    providedIn: 'root'
})
export class PeopleStrapiMappingService implements IBaseMapping<Person> {
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

    getPaginated(page: number, pageSize: number, pages: number, data: Data<PersonRaw>[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:Data<PersonRaw>)=>{
            return this.getOne(d);
        })};
    }

    getOne(data: Data<Person>): Person {
        return {
            id:data.id.toString(), 
            name:data.attributes.name, 
            surname:data.attributes.surname, 
            gender:this.fromGenderMapping[data.attributes.gender],
            groupID:typeof data.attributes.group === 'object'?data.attributes.group?.data.id.toString():undefined,
        };
    }

    getAdded(data: PersonRaw): Person {
        return this.getOne(data.data);
    }

    getUpdated(data: PersonRaw): Person {
        return this.getOne(data.data);
    }

    getDeleted(data: PersonRaw): Person {
        return this.getOne(data.data);
    }

    setAdd(data: Person): PersonData {
        return {
            attributes: {
                name:data.name, 
                surname:data.surname,
                gender:this.toGenderMapping[data.gender],
                group:Number(data.groupID)??'',
            }
        };
    }

    setUpdate(data: Person): PersonData {
        let toReturn:PersonData = {
            attributes: {
                name:"", 
                surname:"",
                gender:"",
                group:null,
            }
        }
        Object.keys(data).forEach(key=>{
            switch (key) {
                case 'name':
                    toReturn.attributes['name']=data[key]
                    break;
                case 'surname':
                    toReturn.attributes['surname']=data[key]
                    break;
                case 'gender':
                    toReturn.attributes['gender']=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other'
                    break;
                case 'groupID':
                    toReturn.attributes['group']=Number(data[key])??''
                    break;
                default:
                    break;
            }
        })
        return toReturn;
    }
}