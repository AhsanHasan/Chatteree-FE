import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fav-contacts-slider',
  templateUrl: './fav-contacts-slider.component.html',
  styleUrls: ['./fav-contacts-slider.component.css']
})
export class FavContactsSliderComponent implements OnChanges {
  @ViewChild('carouselItems') carouselItems: ElementRef | undefined;
  @Input() favChatrooms: any;
  @Output() selecteParticipantSignal = new EventEmitter<any>();

  constructor() { }

  ngOnChanges(): void {
  }

  scrollLeft(): void {
    this.carouselItems!.nativeElement.scrollTo({
      left: this.carouselItems!.nativeElement.scrollLeft - this.carouselItems!.nativeElement.clientWidth / 3,
      behavior: 'smooth'
    });
  }

  scrollRight(): void {
    this.carouselItems!.nativeElement.scrollTo({
      left: this.carouselItems!.nativeElement.scrollLeft + this.carouselItems!.nativeElement.clientWidth / 3,
      behavior: 'smooth'
    });
  }

  selectParticipant(chatroom: any): void {
    this.favChatrooms = this.favChatrooms.map((room: any) => {
      if (room.chatRoom._id === chatroom._id) {
        room.unreadMessages = 0;
      }
      return room;
    });
    this.selecteParticipantSignal.emit({ user: chatroom.participants, chatroom, chatroomId: chatroom._id });
  }
}
