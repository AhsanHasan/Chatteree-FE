import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SearchPeopleService } from './services/search-people.service';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/interfaces/pagination.interface';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { PusherService } from 'src/app/services/pusher.service';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { FavoriteChatroomService } from './services/favorite-chatroom.service';
import { Utils } from 'src/app/utils';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('chatroom') chatRoom: ChatRoomComponent | undefined;
  @ViewChild('chatWindow') chatWindow: ChatWindowComponent | undefined;
  dropdownOpen = false;
  users: Array<User> = [];
  selectedParticipant: User | null | undefined = null;
  selectedChatroomId: string | null = null;
  selectedChatroom: any;
  pagination: Pagination = {
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };
  favChatrooms: any;
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private pusherService: PusherService,
    private favoriteChatroomService: FavoriteChatroomService
  ) {
    this.route.data.subscribe((data: any) => {
      this.users = data.users.data.users;
      this.favChatrooms = data.favorites.data;
      this.pagination = data.users.data.pagination;
    });
    this.pusherService.messageSubject.subscribe((data: any) => {
      this.messageReceivedSignal();
      this.chatWindow?.getChatroomMessages(null);
      this.getFavorites();
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.selectedParticipant = this.chatRoom?.selectedParticipant;
    this.cdr.detectChanges();
  }

  openSearchPeopleModal(): void {
    this.searchPeopleService.togglePopup();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  async chatRoomSelected(participants: any): Promise<void> {
    await this.chatRoom?.getAllChatRooms();
    this.selectedParticipant = participants && participants.length > 1 ?
      participants.find((participant: User) => participant._id !== this.authenticationService.auth?.user._id) : null;
  }

  participantUpdated(data: any): void {
    this.selectedParticipant = data.user;
    this.selectedChatroomId = data.chatroomId;
    this.selectedChatroom = data.chatroom;
    this.chatRoom?.selectChatroom(this.selectedChatroom);
  }

  messageReceivedSignal(): void {
    this.chatRoom?.getAllChatRooms();
  }

  async chatroomFavoriteSignal(data: any): Promise<void> {
    await this.getFavorites();
  }

  async getFavorites(): Promise<void> {
    try {
      const response = await this.favoriteChatroomService.getAllFavoriteChatrooms();
      if (response && response.success) {
        this.favChatrooms = response.data;
      }
    } catch (error) {
      Utils.showErrorMessage('An error occurred while fetching favorites', error);
    }
  }
}