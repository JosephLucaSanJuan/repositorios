import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { timer } from 'rxjs';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone:true,
  providers:[IonicModule, LottieComponent]
})
export class SplashPage implements OnInit {

  options: AnimationOptions = {
    path: '/assests/lotties/Animation - Splash.json'
  }
  
  onAnimationCreated(animationItem:AnimationItem):void {
    console.log('Animación creada:', animationItem)
  }

  constructor(
    private router: Router,
    private authSVC:BaseAuthenticationService
  ) { }

  ngOnInit() {
    timer(5000).subscribe(_=>{
      this.router.navigate(['/home'])
    })
  }

}
