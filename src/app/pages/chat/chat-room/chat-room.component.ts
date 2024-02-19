import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chatroom } from '../interfaces/chatroom.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatroomService, PaginationQuery } from '../services/chatroom.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent {
  @Output() participantUpdated = new EventEmitter<any>();
  chatRooms: Array<Chatroom> = [];
  selectedParticipant: User | null = null;
  constructor(
    private route: ActivatedRoute,
    private chatroomService: ChatroomService,
    public authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.route.data.subscribe((data: any) => {
      this.chatRooms = data.chatrooms.data.chatRooms;
    });
  }

  async getAllChatRooms(page = 1, limit = 10): Promise<void> {
    try {
      const query = {
        page,
        limit
      } as PaginationQuery;
      const response = await this.chatroomService.getAllChatrooms(query);
      if (response && response.success) {
        this.chatRooms = response.data.chatRooms;
      }
    } catch (error) {
      console.error('Failed to get chat rooms', error);
    }
  }

  selectChatroom(chatroom: Chatroom): void {
    this.selectedParticipant = chatroom.participants;
    // Set unreadMessages to 0 for the selected chatroom
    this.chatRooms = this.chatRooms.map((room) => {
      if (room._id === chatroom._id) {
        room.unreadMessages = 0;
      }
      return room;
    });
    this.participantUpdated.emit({ user: chatroom.participants, chatroomId: chatroom._id });
  }
}
