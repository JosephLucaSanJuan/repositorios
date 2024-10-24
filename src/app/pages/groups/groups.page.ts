import { Component, OnInit } from '@angular/core';
import { AnimationController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  
  _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([])
  groups$:Observable<Group[]> = this._groups.asObservable()

  constructor(
    private animationCtrl: AnimationController,
    private modalCtrl: ModalController,
    private peopleSVC: PeopleService
  ) { }

  ngOnInit() {
  }

}
