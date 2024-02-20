import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

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

  scrollLeft() {
    // this.carouselItems!.nativeElement.scrollLeft -= this.carouselItems!.nativeElement.clientWidth / 3;
    this.carouselItems!.nativeElement.scrollTo({
      left: this.carouselItems!.nativeElement.scrollLeft - this.carouselItems!.nativeElement.clientWidth / 3,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    // Scroll by 1/3 of the width to show the next item partially and make it smooth
    this.carouselItems!.nativeElement.scrollTo({
      left: this.carouselItems!.nativeElement.scrollLeft + this.carouselItems!.nativeElement.clientWidth / 3,
      behavior: 'smooth'
    });
  }

  selectParticipant(chatroom: any) {
    debugger;

    this.favChatrooms = this.favChatrooms.map((room: any) => {
      if (room.chatRoom._id === chatroom._id) {
        room.unreadMessages = 0;
      }
      return room;
    });
    this.selecteParticipantSignal.emit({user: chatroom.participants, chatroom, chatroomId: chatroom._id});
  }
}
