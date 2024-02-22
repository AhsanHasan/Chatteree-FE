import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-searchable-chat-room',
  templateUrl: './searchable-chat-room.component.html',
  styleUrls: ['./searchable-chat-room.component.css']
})
export class SearchableChatRoomComponent implements OnChanges {
  @Output() userActionSignal = new EventEmitter<any>();
  matchedMessages: Array<any> = [];
  matchedUsers: Array<any> = [];

  constructor(
    public authenticationService: AuthenticationService
  ) { }

  ngOnChanges(): void {}

  selectChatroom(chatroom: any): void {
    this.userActionSignal.emit({ user: chatroom.participants, chatroomId: chatroom._id, chatroom });
  }

}
