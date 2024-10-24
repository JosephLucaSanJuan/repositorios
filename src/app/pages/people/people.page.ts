import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {
  
  _people:BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([])
  people$:Observable<Person[]> = this._people.asObservable()

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

  selectedPerson:any = null
  isAnimating = false
  page:number = 1
  pageSize:number = 25

  getMorePeople(notify:HTMLIonInfiniteScrollElement|null = null){
    this.peopleSVC.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Person>)=>{
        this._people.next([...response.data]);
        this.page++
        notify?.complete()
      }
    })
  }

  async openPersonDetail(person:any, index:number){
    this.selectedPerson = person
    const avatarElements = this.avatars.toArray()
    const clickedAvatar = avatarElements[index].nativeElement

    const avatarRect = clickedAvatar.getBoundingClientRect()
    this.isAnimating = true
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent){
    this.getMorePeople(ev.target)
  }

  async onAddPerson(){
    const modal = await this.modalCtrl.create({
      component:PersonModalComponent,
      componentProps:{}
    })
    modal.onDidDismiss().then((res:any)=>{
      console.log(res)
    })
    await modal.present()
  }

}
