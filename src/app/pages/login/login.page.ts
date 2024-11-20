import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSVC: BaseAuthenticationService
  ) { 
    this.form = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }

  ngOnInit() {
  }

  login(){
    if (this.form.valid) {
      this.authSVC.sigIn(this.form.value).subscribe({
        next:resp=>{
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home'
          this.router.navigateByUrl(returnUrl)
        },
        error:err=>{
          console.log(err)
        }
      })
    } else {
      console.log('Formulario inválido')
    }
  }

  onRegister(){
    this.form.reset()
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home'
    this.router.navigate(['/register'], {queryParams:returnUrl, replaceUrl:true})
  }

  get email() {
    return this.form.controls['email']
  }

  get password() {
    return this.form.controls['password']
  }

}
