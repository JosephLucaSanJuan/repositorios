import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupService } from 'src/app/core/services/impl/groups.service';

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
    private groupsSVC: GroupService
  ) { }

  ngOnInit() {
    this.getMoreGroups()
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef

  selectedGroup:any = null
  isAnimating = false
  page:number = 1
  pageSize:number = 25

  getMoreGroups(notify:HTMLIonInfiniteScrollElement|null = null){
    this.groupsSVC.getAll(this.page, this.pageSize).subscribe({
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

    // Obtener las coordenadas del avatar clicado
    const avatarRect = clickedAvatar.getBoundingClientRect()

    // Mostrar el contenedor animado
    this.isAnimating = true

    // Configurar la posición inicial de la imagen animada
    const animatedAvatarElement = this.animatedAvatar.nativeElement as HTMLElement;
    animatedAvatarElement.style.position = 'absolute';
    animatedAvatarElement.style.top = `${avatarRect.top}px`;
    animatedAvatarElement.style.left = `${avatarRect.left}px`;
    animatedAvatarElement.style.width = `${avatarRect.width}px`;
    animatedAvatarElement.style.height = `${avatarRect.height}px`;

    // Crear la animación
    const animation = this.animationCtrl.create()
      .addElement(animatedAvatarElement)
      .duration(500)
      .easing('ease-out')
      .fromTo('transform', 'translate(0, 0) scale(1)', `translate(${window.innerWidth / 2 - avatarRect.left - avatarRect.width / 2}px, ${window.innerHeight / 2 - avatarRect.top - avatarRect.height / 2}px) scale(5)`);

    // Iniciar la animación
    await animation.play();
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
