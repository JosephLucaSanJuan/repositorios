import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Group } from "../../models/group.model";
import { Paginated } from "../../models/paginated.model";

export interface GroupRaw{
    data:Data,
    meta:Meta
}

export interface GroupAttributes {
    name: string
    createdAt?:string
    updatedAt?:string
    publishedAt?:string
}

export interface Data {
    id:number
    attributes:GroupAttributes
}

export interface GroupData {
    attributes:GroupAttributes
}

export interface Meta{}

@Injectable({
    providedIn: 'root'
})
export class GroupMappingStrapiServer implements IBaseMapping<Group>{

    setAdd(data: Group):GroupData {
        return {
            attributes:{
                name:data.name
            }
        };
    }

    setUpdate(data: any):GroupData {
        let toReturn:GroupData = {
            attributes:{
                name:""
            }
        };
        Object.keys(data).forEach(key=>{
            switch (key) {
                case "name":
                    toReturn.attributes['name']=data[key]
                    break;
            
                default:
                    break;
            }
        })
        return toReturn
    }

    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Group> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Group>((d:Data)=>{
            return this.getOne(d)
        })};
    }

    getOne(data: Data): Group {
        return {
            id:data.id.toString(),
            name:data.attributes.name
        };
    }

    getAdded(data: GroupRaw): Group {
        return this.getOne(data.data);
    }
    getUpdated(data: GroupRaw): Group {
        return this.getOne(data.data);
    }
    getDeleted(data: GroupRaw): Group {
        return this.getOne(data.data);
    }

}