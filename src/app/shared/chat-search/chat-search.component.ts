import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    public authenticationService: AuthenticationService,
    private router: Router
  ) { }

  selectChatroom(chatroom: any): void {
    this.userActionSignal.emit({ user: chatroom.participants, chatroomId: chatroom._id, chatroom });
  }

  selectChat(chatroom: any): void {
    this.userActionSignal.emit({ user: chatroom.participants, chatroomId: chatroom._id, chatroom });
    this.router.navigate(['/m-chat', chatroom._id], {
      queryParams: {
        search: chatroom.messages._id
      }
    });
  }

}
