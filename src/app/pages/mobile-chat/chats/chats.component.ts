import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Chatroom } from '../../chat/interfaces/chatroom.interface';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  slides = [
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" }
  ];
  slideConfig = {
    'slidesToShow': 3,
    'slidesToScroll': 1,
    'arrows': false,
    'variableWidth': true
  };

  chatrooms: Array<Chatroom> = [];

  constructor(
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.route.data.subscribe((data: any) => {
      console.log(data);
      this.chatrooms = data.chatrooms.data.chatRooms;
    });
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }

  selectChatroom(chatroom: Chatroom): void {
    this.router.navigate([`/m-chat/${chatroom._id}`]);
  }
}
