// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GroupRepositoryFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people.service';
import { GROUP_API_URL_TOKEN, GROUP_REPOSITORY_MAPPING_TOKEN, GROUP_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN } from './core/repositories/repository.tokens';
import { provideHttpClient } from '@angular/common/http';
import { PeopleHttpMapping } from './core/repositories/impl/people-mapping-http.service';
import { PeopleLocalStorageMapping } from './core/repositories/impl/people-mapping-local-storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupService } from './core/services/impl/groups.service';
import { GroupMappingJsonServerService } from './core/repositories/impl/group-mapping-json-server.service';
import { PersonModalComponent } from './components/person-modal/person-modal.component';
@NgModule({
  declarations: [AppComponent, PersonModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'personas' },
    { provide: GROUP_RESOURCE_NAME_TOKEN, useValue: 'grupos' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: 'https://localhost:3000/personas' },
    { provide: GROUP_API_URL_TOKEN, useValue: 'https://localhost:3000/grupos' },
    // Registrar los repositorios
    { 
      provide: PEOPLE_REPOSITORY_MAPPING_TOKEN, 
      useClass: PeopleLocalStorageMapping
    },
    {
      provide: GROUP_REPOSITORY_MAPPING_TOKEN,
      useClass: GroupMappingJsonServerService
    },
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
    }
  ],
  // ... otros proveedores],
  bootstrap: [AppComponent],
})
export class AppModule {}
