import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service.service";
import { Group } from "../../models/group.model";
import { GROUP_REPOSITORY_TOKEN } from "../../repositories/repository.tokens";
import { IPeopleRepository } from "../../repositories/intefaces/people-repository.interface";
import { IGroupService } from "../interfaces/group-service.interface";

@Injectable({
    providedIn: 'root'
})
export class GroupService extends BaseService<Group> implements IGroupService{
    constructor(
        @Inject(GROUP_REPOSITORY_TOKEN) repository: IPeopleRepository
    ) {
        super(repository)
    }
}