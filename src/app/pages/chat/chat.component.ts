import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  dropdownOpen = false;
  constructor(
    public authenticationService: AuthenticationService
  ) { }
  
  ngOnInit() {}
}
