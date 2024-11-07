import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { GroupService } from 'src/app/core/services/impl/groups.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {
  
  _people:BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([])
  people$:Observable<Person[]> = this._people.asObservable()

  public alertYesNoButtons = [
    {
      text: 'No',
      role: 'no'
    },
    {
      text: 'Yes',
      role: 'yes'
    }
  ]

  constructor(
    private animationCtrl: AnimationController,
    private modalCtrl: ModalController,
    private groupSVC: GroupService,
    private peopleSVC: PeopleService
  ) { }

  ngOnInit() {
    this.refresh()
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef

  selectedPerson:any = null
  isAnimating = false
  page:number = 1
  pageSize:number = 25
  pages:number = 0

  refresh(){
    this.page=1;
    this.peopleSVC.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Person>)=>{
        this._people.next([...response.data])
        this.page++
        this.pages = response.pages
      }
    })
  }

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
    await this.presentModalPerson('edit', person)
    this.selectedPerson = person
    /*const avatarElements = this.avatars.toArray()
    const clickedAvatar = avatarElements[index].nativeElement

    const avatarRect = clickedAvatar.getBoundingClientRect()
    this.isAnimating = true*/
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent){
    this.getMorePeople(ev.target)
  }

  private async presentModalPerson(mode:'new'|'edit', person:Person|undefined=undefined){
    let _groups:Group[] = await lastValueFrom(this.groupSVC.getAll())
    const modal = await this.modalCtrl.create({
      component:PersonModalComponent,
      componentProps:(mode=='edit'?{
        person:person,
        groups:_groups
      }:{
        groups:_groups
      })
    })
    modal.onDidDismiss().then((res:any)=>{
      switch (res.role) {
        case 'new':
          this.peopleSVC.add(res.data).subscribe({
            next:res=>{
              this.refresh()
            },
            error:err=>{}
          })
          break;
        case 'edit':
          this.peopleSVC.update(person!.id, res.data).subscribe({
            next:res=>{
              this.refresh()
            },
            error:err=>{}
          })
          break;
        default:
          break;
      }
    })
    await modal.present()
  }

  async onAddPerson(){
    await this.presentModalPerson('new')
  }

  onDeletePerson(event:CustomEvent, person:Person){
    if (event.detail.role == 'yes'){
      this.peopleSVC.delete(person.id).subscribe({
        next:response=>{
          this.refresh()
        },
        error:err=>{}
      })
    }
  }

}
