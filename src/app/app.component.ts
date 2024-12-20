import { Component } from '@angular/core';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public authSVC:BaseAuthenticationService,
    private router:Router
  ) {}
  
  logout(){
    this.authSVC.signOut().subscribe(_=>{
      this.router.navigate(['login'])
    })
  }
}
