import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Person } from 'src/app/core/models/person.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  genders:string[] = ['Masculino', 'Femenino', 'Otros'];
  formGroup: FormGroup;
  person?: Person | null;

  constructor(
    private formBuilder: FormBuilder,
    private peopleSVC: PeopleService,
    private authSVC: BaseAuthenticationService,
    private mediaSVC: BaseMediaService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private translateSVC: TranslateService
  ) { 
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      groupID: [null, []],
      picture: ['']
    })
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create()
    await loading.present()

    try {
      const user = await this.authSVC.getCurrent()
      if (user) {
        this.person = await lastValueFrom(this.peopleSVC.getUserById(user.id))
        console.log(this.person)
        if (this.person) {
          const updatedPerson:any = {
            ...this.person,
            email:user.email,
            userID:user.id,
            picture: typeof this.person.picture === 'object' ?
                            this.person.picture.url:undefined
          }
          this.formGroup.patchValue(updatedPerson)
        }
      }
    } catch (error) {
      console.log(error)
      const toast = await this.toastCtrl.create({
        message: await lastValueFrom(this.translateSVC.get('COMMON.ERROR.LOAD')),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss()
    }
  }

  async onSubmit() {
    if (this.formGroup.valid && this.person) {
      const loading = await this.loadingCtrl.create()
      await loading.present()

      try {
        const changedValues = {} as Record<keyof Person, any>
        Object.keys(this.formGroup.controls).forEach( key => {
          if (this.formGroup.get(key)?.dirty) {
            changedValues[key as keyof Person] = this.formGroup.get(key)?.value
          }
        })
        if (changedValues.picture) {
          const updatedPerson = await fetch(changedValues.picture)
          const blob = await updatedPerson.blob()
          const uploadedBlob = await lastValueFrom(this.mediaSVC.upload(blob))
          changedValues.picture = uploadedBlob[0]
        }
        await lastValueFrom(this.peopleSVC.update(this.person.id, changedValues))
        const toast = await this.toastCtrl.create({
          message: await lastValueFrom(this.translateSVC.get('COMMON.SUCCESS.SAVE')),
          duration: 3000,
          position: 'bottom'
        });
      } catch (error) {
        console.log(error)
        const toast = await this.toastCtrl.create({
          message: await lastValueFrom(this.translateSVC.get('COMMON.ERROR.SAVE')),
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      } finally {
        await loading.dismiss()
      }
    }
  }

  get name() {
    return this.formGroup.controls['name']
  }

  get surname() {
    return this.formGroup.controls['surname']
  }

  get email() {
    return this.formGroup.controls['email']
  }

  get age() {
    return this.formGroup.controls['age']
  }

  get gender() {
    return this.formGroup.controls['gender']
  }

}
