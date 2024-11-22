import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Person } from "../../models/person.model";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";

interface MediaRaw{
    data: StrapiMedia
}
interface UserRaw{
    data: UserData
}

interface UserData{
    id: number
    attributes: UserAttributes
}

interface UserAttributes {
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

export interface GroupRaw{
    data:GroupData,
    meta:Meta
}

export interface GroupAttributes {
    name: string
}

export interface GroupData {
    id:number
    attributes:GroupAttributes
}

export interface PersonRaw{
    data:Data,
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
    user: UserRaw | number | null
    picture: MediaRaw | number | null
}

export interface Data {
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

    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Person> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Person>((d:Data)=>{
            return this.getOne(d);
        })};
    }

    getOne(data: Data | PersonRaw): Person {
        const isPersonRaw = (data: Data | PersonRaw): data is PersonRaw => 'meta' in data

        const id = isPersonRaw(data) ? data.data.id : data.id
        const attributes = isPersonRaw(data) ? data.data.attributes : data.attributes
        return {
            id:id.toString(), 
            name:attributes.name, 
            surname:attributes.surname, 
            gender:this.fromGenderMapping[attributes.gender],
            groupID:typeof attributes.group === 'object'?attributes.group?.data?.id.toString():undefined,
            userID:typeof attributes.user === 'object'?attributes.user?.data?.id.toString():undefined,
            picture:typeof attributes.picture === 'object'? {
                url:attributes.picture?.data?.attributes.url,
                large:attributes.picture?.data?.attributes?.formats?.large?.url || attributes.picture?.data?.attributes.url,
                medium:attributes.picture?.data?.attributes?.formats?.medium?.url || attributes.picture?.data?.attributes.url,
                small:attributes.picture?.data?.attributes?.formats?.small?.url || attributes.picture?.data?.attributes.url,
                thumbnail:attributes.picture?.data?.attributes?.formats?.thumbnail?.url || attributes.picture?.data?.attributes.url,
            }:undefined
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
                group:data.groupID?Number(data.groupID):null,
                user:data.userID?Number(data.userID):null,
                picture:data.picture?Number(data.picture):null
            }
        };
    }

    setUpdate(data: Partial<Person>): PersonData {
        const toReturn:Partial<PersonAttributes> = {}
        Object.keys(data).forEach(key=>{
            switch (key) {
                case 'name':
                    toReturn.name=data[key]
                    break;
                case 'surname':
                    toReturn.surname=data[key]
                    break;
                case 'gender':
                    toReturn.gender=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other'
                    break;
                case 'groupID':
                    toReturn.group= data[key] ? Number(data[key]):null
                    break;
                case 'userID':
                    toReturn.user= data[key] ? Number(data[key]):null
                    break;
                case 'picture':
                    toReturn.picture= data[key] ? Number(data[key]):null
                    break;
                default:
                    break;
            }
        })
        return { attributes:toReturn as PersonAttributes };
    }
}