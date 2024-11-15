import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userRegister: FormGroup

  private _users:BehaviorSubject<User[]> = new BehaviorSubject<User[]>([])
  public users$:Observable<User[]> = this._users.asObservable()

  @Input() set user(_user:User) {
    this.userRegister.controls['email'].setValue(_user.email)
    this.userRegister.controls['username'].setValue(_user.username)
    this.userRegister.controls['password'].setValue(_user.password)
  }

  constructor(
    private fb: FormBuilder
  ) { 
    this.userRegister = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      username:['', Validators.required, Validators.minLength(2)],
      password:['', Validators.required, Validators.minLength(6)]
    })
  }

  ngOnInit() {
  }

  get email() {
    return this.userRegister.controls['email']
  }

  get username() {
    return this.userRegister.controls['username']
  }

  get password() {
    return this.userRegister.controls['password']
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
      console.log('Usuario registrado')
    } else {
      console.log('Usuario registrado')
    }
  }

}
