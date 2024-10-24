import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
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

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef

  selectedGroup:any = null
  isAnimating = false
  page:number = 1
  pageSize:number = 25

  getMoreGroups(notify:HTMLIonInfiniteScrollElement|null = null){
    this.peopleSVC.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Group>)=>{
        this._groups.next([...response.data]);
        this.page++
        notify?.complete()
      }
    })
  }

  async openGroupDetail(group:any, index:number){
    this.selectedGroup = group
    const avatarElements = this.avatars.toArray()
    const clickedAvatar = avatarElements[index].nativeElement

    const avatarRect = clickedAvatar.getBoundingClientRect()
    this.isAnimating = true
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent){
    this.getMoreGroups(ev.target)
  }

  /*async onAddGroup(){
    const modal = await this.modalCtrl.create({
      component:PersonModalComponent,
      componentProps:{}
    })
    modal.onDidDismiss().then((res:any)=>{
      console.log(res)
    })
    await modal.present()
  }*/

}
