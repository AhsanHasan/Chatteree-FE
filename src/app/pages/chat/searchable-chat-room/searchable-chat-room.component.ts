import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    public authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnChanges(): void {}

  selectChatroom(chatroom: any): void {
    this.userActionSignal.emit({ user: chatroom.participants, chatroomId: chatroom._id, chatroom });
  }

  selectChat(chatroom: any): void {
    this.userActionSignal.emit({ user: chatroom.participants, chatroomId: chatroom._id, chatroom });
    this.router.navigate(['/chat', chatroom._id], {
      queryParams: {
        search: chatroom.messages._id
      }
    });
  }

}
