import { Component, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonInput, IonPopover } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupService } from 'src/app/core/services/impl/groups.service';

@Component({
  selector: 'app-group-selectable',
  templateUrl: './group-selectable.component.html',
  styleUrls: ['./group-selectable.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>GroupSelectableComponent),
      multi:true
    }
  ]
})
export class GroupSelectableComponent implements OnInit, ControlValueAccessor {

  private _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([])
  public groups$:Observable<Group[]> = this._groups.asObservable()
  @Input() set groups(groups:Group[]){
    this._groups.next(groups)
  }

  selectedGroup:Group|null = null
  onChanged:any
  onTouched:any
  disabled:boolean = false
  page:number = 1
  pageSize:number = 25
  pages:number = 0

  propagateChange = (obj:any) => {}
  @ViewChild('popover', { read:IonPopover }) popover: IonPopover | undefined

  constructor(public groupSVC:GroupService) { }

  ngOnDestroy():void{
    this.popover?.dismiss()
  }

  onLoadGroups() {
    this.loadGroups("")
  }

  private async loadGroups(filter:String){
    this.page=1;
    this.groupSVC.getAll(this.page, this.pageSize).subscribe({
      next:response=>{
        this._groups.next([...response.data])
        this.page++
        this.pages = response.pages
      },
      error:err=>{}
    })
  }

  loadMorGroups(notify:HTMLIonInfiniteScrollElement|null = null){
    if (this.page<=this.pages) {
      this.groupSVC.getAll(this.page, this.pageSize).subscribe({
        next:(response:Paginated<Group>)=>{
          this._groups.next([...response.data]);
          this.page++
          notify?.complete()
        }
      })
    } else {
      notify?.complete()
    }
  }

  onMoreGroups(ev:InfiniteScrollCustomEvent){
    this.loadMorGroups(ev.target)
  }

  private async selectGroup(id:string|undefined, propagate:boolean=false){
    if (id) {
      this.selectedGroup = await lastValueFrom(this.groupSVC.getById(id))
    } else {
      this.selectedGroup = null
    }
    if (propagate && this.selectedGroup) {
      this.propagateChange(this.selectedGroup.id)
    }
  }

  writeValue(obj: any): void {
    this.selectGroup(obj);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  ngOnInit() {}

  private async filter(filtering:string){
    this.loadGroups(filtering)
  }

  onFilter(event:any){
    this.filter(event.detail.value)
  }

  onGroupClicked(popover:IonPopover, group:Group){
    this.selectGroup(group.id,true)
    popover.dismiss()
  }

  clearSearch(input:IonInput){
    input.value = ""
    this.filter("")
  }

  deselect(popover:IonPopover|null=null){
    this.selectGroup(undefined, true)
    if (popover) {
      popover.dismiss()
    }
  }

  onSelectionChanged(event:any){
    this.selectedGroup = event.detail.value
    this.onChanged(this.selectedGroup)
    this.onTouched()
  }

}
