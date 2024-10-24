import { Injectable } from '@angular/core';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Group } from '../../models/group.model';
import { Paginated } from '../../models/paginated.model';

export interface GroupRaw{
    id:string,
    name:string
}

@Injectable({
    providedIn: 'root'
})
export class GroupMappingJsonServerService implements IBaseMapping<Group> {

    constructor() { }

    getPaginated(page: number, pageSize: number, pages: number, data: GroupRaw[]): Paginated<Group> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Group>((d:GroupRaw)=>{
            return this.getOne(d)
        })}
    }

    getOne(data: GroupRaw): Group {
        return {
            id:data.id,
            name:data.name
        }
    }
    
    getAdded(data: any): Group {
        throw new Error('Method not implemented.');
    }

    getUpdated(data: any): Group {
        throw new Error('Method not implemented.');
    }

    getDeleted(data: any): Group {
        throw new Error('Method not implemented.');
    }

    setAdd(data: Group) {
        throw new Error('Method not implemented.');
    }
    
    setUpdate(data: any) {
        throw new Error('Method not implemented.');
    }
}
