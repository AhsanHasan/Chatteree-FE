import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-chat-search',
  templateUrl: './chat-search.component.html',
  styleUrls: ['./chat-search.component.css']
})
export class ChatSearchComponent {
  @Output() userActionSignal = new EventEmitter<any>();
  matchedMessages: Array<any> = [];
  matchedUsers: Array<any> = [];

  constructor(
    public authenticationService: AuthenticationService
  ) { }

  selectChatroom(chatroom: any): void {
    this.userActionSignal.emit({ user: chatroom.participants, chatroomId: chatroom._id, chatroom });
  }

}
