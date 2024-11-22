// src/app/repositories/repository.factory.ts
import { FactoryProvider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryHttpService } from './impl/base-repository-http.service';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { Person } from '../models/person.model';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, GROUP_API_URL_TOKEN, GROUP_REPOSITORY_MAPPING_TOKEN, GROUP_REPOSITORY_TOKEN, GROUP_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_REPOSITORY_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN } from './repository.tokens';
import { BaseRespositoryLocalStorageService } from './impl/base-repository-local-storage.service';
import { Model } from '../models/base.model';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { JSONServerRepositoryService } from './impl/json-server-repository.service';
import { Group } from '../models/group.model';
import { StrapiRepositoryService } from './impl/strapi-repository.service';
import { PeopleLocalStorageMapping } from './impl/people-mapping-local-storage.service';
import { PeopleStrapiMappingService } from './impl/people-mapping-strapi.service';
import { PeopleHttpMapping } from './impl/people-mapping-http.service';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { StrapiAuthenticationService } from '../services/impl/strapi-authentication.service';
import { IAuthMapping } from '../services/interfaces/auth-mapping.interface';
import { BaseMediaService } from '../services/impl/base-media.service';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { StrapiMediaService } from '../services/impl/strapi-media.service';
// Importa otros modelos según sea necesario

export function createHttpRepository<T extends Model>(http: HttpClient, apiUrl: string, resource:string, mapping:IBaseMapping<T>): IBaseRepository<T> {
  return new BaseRepositoryHttpService<T>(http, apiUrl, resource, mapping);
}

export function createLocalStorageRepository<T extends Model>(resource: string, mapping:IBaseMapping<T>): IBaseRepository<T> {
  return new BaseRespositoryLocalStorageService<T>(resource, mapping);
}

export function createJSONServerRepository<T extends Model>(http: HttpClient, apiUrl: string, resource: string, mapping: IBaseMapping<T>): IBaseRepository<T> {
  return new JSONServerRepositoryService<T>(http, apiUrl, resource, mapping)
}

export function createStrapiRepository<T extends Model>(http: HttpClient, apiUrl: string, resource: string, mapping: IBaseMapping<T>): IBaseRepository<T> {
  return new StrapiRepositoryService<T>(http, apiUrl, resource, mapping)
}

// Ejemplo de configuración para People
export const PeopleRepositoryFactory: FactoryProvider = {
  provide: PEOPLE_REPOSITORY_TOKEN,
  useFactory: (backend: string, http: HttpClient, apiURL:string, resource:string, mapping:IBaseMapping<Person>) => {
    // Aquí puedes decidir qué implementación usar
    // Por ejemplo, usar Firebase:
    switch (backend) {
      case 'http':
        return createHttpRepository<Person>(http, apiURL, resource, mapping);
        break;

      case 'strapi':
        return createStrapiRepository<Person>(http, apiURL, resource, mapping);
        break;
    //
      case 'local-storage':
        return createLocalStorageRepository<Person>(resource, mapping)
        break;

      case 'json-server':
        return createJSONServerRepository<Person>(http, apiURL, resource, mapping);
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN, HttpClient, PEOPLE_API_URL_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN]
};

// Ejemplo de configuración para Groups
export const GroupRepositoryFactory: FactoryProvider = {
  provide: GROUP_REPOSITORY_TOKEN,
  useFactory: (backend: string, http: HttpClient, apiURL:string, resource:string, mapping:IBaseMapping<Group>) => {
    // Aquí puedes decidir qué implementación usar
    switch (backend) {
      case 'http':
        return createHttpRepository<Group>(http, apiURL, resource, mapping);
        break;

      case 'strapi':
        return createStrapiRepository<Group>(http, apiURL, resource, mapping);
        break;
    
      case 'local-storage':
        return createLocalStorageRepository<Group>(resource, mapping)
        break;

      case 'json-server':
        return createJSONServerRepository<Group>(http, apiURL, resource, mapping);
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN, HttpClient, GROUP_API_URL_TOKEN, GROUP_RESOURCE_NAME_TOKEN, GROUP_REPOSITORY_MAPPING_TOKEN]
};

// Repite esto para otros modelos como Usuario, etc.

export const PeopleMappingFactory: FactoryProvider = {
  provide: PEOPLE_REPOSITORY_MAPPING_TOKEN,
  useFactory: (backend: string) => {
    switch (backend) {
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
        break;

      case 'strapi':
        return new PeopleStrapiMappingService();
        break;
    //
      case 'local-storage':
        return new PeopleLocalStorageMapping()
        break;

      case 'json-server':
        return new PeopleHttpMapping();
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN]
};

export const GroupsMappingFactory: FactoryProvider = {
  provide: GROUP_REPOSITORY_MAPPING_TOKEN,
  useFactory: (backend: string) => {
    switch (backend) {
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
        break;

      case 'strapi':
        return new PeopleStrapiMappingService();
        break;
    //
      case 'local-storage':
        return new PeopleLocalStorageMapping()
        break;

      case 'json-server':
        return new PeopleHttpMapping();
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN]
};

export const AuthMappingFactory: FactoryProvider = {
  provide: AUTH_MAPPING_TOKEN,
  useFactory: (backend: string, signIn:string, signUp:string, me:string, mapping:IAuthMapping, httpClient:HttpClient) => {
    switch (backend) {
      case 'strapi':
        return new StrapiAuthenticationService(signIn, signUp, me, mapping, httpClient);
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN]
};

export const AuthenticationServiceFactory: FactoryProvider = {
  provide: BaseAuthenticationService,
  useFactory: (backend: string, signIn:string, signUp:string, me:string, mapping:IAuthMapping, httpClient:HttpClient) => {
    switch (backend) {
      case 'strapi':
        return new StrapiAuthenticationService(signIn, signUp, me, mapping, httpClient);
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

export const MediaServiceFactory: FactoryProvider = {
  provide: BaseMediaService,
  useFactory: (backend: string, upload:string, auth:IStrapiAuthentication, httpClient:HttpClient) => {
    switch (backend) {
      case 'strapi':
        return new StrapiMediaService(upload, auth, httpClient);
        break;
    
      default:
        throw new Error("BACKEND NOT IMPLEMENTED")
        break;
    }
  },
  deps: [BACKEND_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};
