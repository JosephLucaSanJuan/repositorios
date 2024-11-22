// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthMappingFactory, AuthenticationServiceFactory, GroupRepositoryFactory, GroupsMappingFactory, MediaServiceFactory, PeopleMappingFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people.service';
import { AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, GROUP_API_URL_TOKEN, GROUP_REPOSITORY_MAPPING_TOKEN, GROUP_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN } from './core/repositories/repository.tokens';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { PeopleHttpMapping } from './core/repositories/impl/people-mapping-http.service';
import { PeopleLocalStorageMapping } from './core/repositories/impl/people-mapping-local-storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupService } from './core/services/impl/groups.service';
import { GroupMappingJsonServerService } from './core/repositories/impl/group-mapping-json-server.service';
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import { GroupSelectableComponent } from './components/group-selectable/group-selectable.component';
import { GroupMappingStrapiServer } from './core/repositories/impl/group-mapping-strapi-server.service';
import { PeopleStrapiMappingService } from './core/repositories/impl/people-mapping-strapi.service';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http:HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [AppComponent, PersonModalComponent, GroupSelectableComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'strapi' },
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'people' },
    { provide: GROUP_RESOURCE_NAME_TOKEN, useValue: 'groups' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: 'https://localhost:1337/api' },
    { provide: GROUP_API_URL_TOKEN, useValue: 'https://localhost:1337/api' },
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: 'https://localhost:1337/api/auth/local' },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: 'https://localhost:1337/api/auth/local/register' },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: 'https://localhost:1337/api/users/me' },
    // Registrar los repositorios
    /*{ 
      provide: PEOPLE_REPOSITORY_MAPPING_TOKEN, 
      useClass: PeopleStrapiMappingService//PeopleLocalStorageMapping
    },
    {
      provide: GROUP_REPOSITORY_MAPPING_TOKEN,
      useClass: GroupMappingStrapiServer//GroupMappingJsonServerService
    },*/
    PeopleMappingFactory,
    GroupsMappingFactory,
    AuthMappingFactory,
    PeopleRepositoryFactory,
    GroupRepositoryFactory,
    // Registrar otros repositorios según sea necesario
    // Servicios de aplicación
    {
      provide: 'PeopleService',
      useClass: PeopleService
    },
    {
      provide: 'GroupService',
      useClass: GroupService
    },
    AuthenticationServiceFactory,
    provideLottieOptions({
      player: () => player,
    }),
    MediaServiceFactory
  ],
  // ... otros proveedores],
  bootstrap: [AppComponent],
})
export class AppModule {}
