// src/app/repositories/repository.tokens.ts
import { InjectionToken } from '@angular/core';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { ITasksRepository } from './intefaces/tasks-repository.interface';
import { IPeopleRepository } from './intefaces/people-repository.interface';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { Person } from '../models/person.model';
import { IAuthentication } from '../services/interfaces/aunthentication.interface';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';

export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');
export const PEOPLE_RESOURCE_NAME_TOKEN = new InjectionToken<string>('PeopleResourceName');
export const GROUP_RESOURCE_NAME_TOKEN = new InjectionToken<string>('GroupResourceName')
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');
export const PEOPLE_REPOSITORY_TOKEN = new InjectionToken<IPeopleRepository>('IPeopleRepository');
export const GROUP_REPOSITORY_TOKEN = new InjectionToken<IPeopleRepository>('IGroupRepository')
export const TASKS_REPOSITORY_TOKEN = new InjectionToken<ITasksRepository>('ITasksRepository');

export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const PEOPLE_API_URL_TOKEN = new InjectionToken<string>('PeopleApiUrl');
export const GROUP_API_URL_TOKEN = new InjectionToken<string>('GroupApiUrl')
export const TASKS_API_URL_TOKEN = new InjectionToken<string>('TasksApiUrl');
export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl')
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl')
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl')
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl')

export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');
export const PEOPLE_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IPeopleRepositoryMapping');
export const GROUP_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IGroupRepositoryMapping')
export const AUTH_TOKEN = new InjectionToken<IAuthentication>('IAuthentication')
export const STRAPI_AUTH_TOKEN = new InjectionToken<IStrapiAuthentication>('IStrapiAuthentication')
export const AUTH_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Person>>('IAuthMapping')
export const BACKEND_TOKEN = new InjectionToken<string>('Backend')