import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';
import { passwordValidator } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userRegister: FormGroup

  /*@Input() set user(_user:User) {
    //this.userRegister.controls['email'].setValue(_user.email)
    this.userRegister.controls['username'].setValue(_user.username)
    //this.userRegister.controls['password'].setValue(_user.password)
  }*/

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private peoplSVC: PeopleService,
    private authSVC: BaseAuthenticationService
  ) { 
    this.userRegister = this.fb.group({
      name:['', Validators.required, Validators.minLength(2)],
      surname:['', Validators.required, Validators.minLength(2)],
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required, passwordValidator],
      confirmPassword:['', Validators.required]
    })
  }

  ngOnInit() {
  }

  get email() {
    return this.userRegister.controls['email']
  }

  get name() {
    return this.userRegister.controls['name']
  }

  get surname() {
    return this.userRegister.controls['surname']
  }

  get password() {
    return this.userRegister.controls['password']
  }

  get confirmPassword() {
    return this.userRegister.controls['confirmPassword']
  }

  getDirtyValues(formGroup:FormGroup):any {
    const dirtyValues:any = {}
    Object.keys(formGroup.controls).forEach(key=>{
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value
      }
    })
    return dirtyValues
  }

  onSubmit(){
    if (this.userRegister.valid) {
      this.authSVC.sigIn(this.userRegister.value).subscribe({
        next: (resp:User) => {
          const userData = {...this.userRegister.value, userID: resp.id.toString()}
          this.peoplSVC.add(userData).subscribe({
            next:resp=>{
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home'
              this.router.navigateByUrl(returnUrl)
            },
            error: err => {}
          })
        },
        error:err=>{
          console.log(err)
        }
      })
    } else {
      console.log('Formulario inválido')
    }
  }

  onLogin(){
    this.userRegister.reset()
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home'
    this.router.navigate(['/login'], {queryParams:returnUrl, replaceUrl:true})
  }

}
