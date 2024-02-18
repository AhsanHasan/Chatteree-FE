import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SearchPeopleService } from './services/search-people.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  dropdownOpen = false;
  showEmojiPopup = true;
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService
  ) { }
  
  ngOnInit() {}

  openSearchPeopleModal(): void {
    this.searchPeopleService.togglePopup();
  }
}
