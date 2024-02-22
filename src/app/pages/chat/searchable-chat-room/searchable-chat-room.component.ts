import { Component, Input, OnChanges } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-searchable-chat-room',
  templateUrl: './searchable-chat-room.component.html',
  styleUrls: ['./searchable-chat-room.component.css']
})
export class SearchableChatRoomComponent implements OnChanges {
  matchedMessages: Array<any> = [];
  matchedUsers: Array<any> = [];

  constructor(
    public authenticationService: AuthenticationService
  ) { }

  ngOnChanges(): void {
    console.log(this.matchedMessages);
    console.log(this.matchedUsers);
  }

}
