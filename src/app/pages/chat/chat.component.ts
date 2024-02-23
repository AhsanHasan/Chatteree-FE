import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SearchPeopleService } from './services/search-people.service';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/interfaces/pagination.interface';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { PusherService } from 'src/app/services/pusher.service';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { FavoriteChatroomService } from './services/favorite-chatroom.service';
import { Utils } from 'src/app/utils';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChatroomService } from './services/chatroom.service';
import { SearchableChatRoomComponent } from './searchable-chat-room/searchable-chat-room.component';
import { DeviceService } from 'src/app/services/device.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('chatroom') chatRoom: ChatRoomComponent | undefined;
  @ViewChild('chatWindow') chatWindow: ChatWindowComponent | undefined;
  @ViewChild('chatroomSearch') chatroomSearch: SearchableChatRoomComponent | undefined;
  userInput$ = new Subject<string>();
  searchInput = '';
  showInitialList = true;

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

  matchedUsers: Array<User> = [];
  matchedMessages: Array<any> = [];
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private pusherService: PusherService,
    private favoriteChatroomService: FavoriteChatroomService,
    private chatroomService: ChatroomService,
    private router: Router
  ) {
    this.route.data.subscribe((data: any) => {
      this.users = data.users.data.users;
      this.favChatrooms = data.favorites.data;
      this.pagination = data.users.data.pagination;
    });
    // Listen to URL param changes
    if (this.route.children && this.route.children.length > 0) {
      this.route.children[0].params.subscribe((params: any) => {
        if (params.id) {
          this.selectedChatroomId = params.id;
        }
      });
    }
    // Listen to pusher service for new messages
    this.pusherService.messageSubject.subscribe((data: any) => {
      this.messageReceivedSignal();
      this.chatWindow?.getChatroomMessages(null);
      this.getFavorites();
    });
    // Listen to the change in favorite chatrooms
    this.favoriteChatroomService.favorite$.subscribe((data: any) => {
      this.getFavorites();
    });
    // Listen to the search input
    this.userInput$.pipe(debounceTime(500)).subscribe((input: string) => {
      this.handleUserSearch(input);
    });
  }

  ngOnInit() { 
  }

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

  async chatRoomSelected(data: any): Promise<void> {
    await this.chatRoom?.getAllChatRooms();
    this.selectedParticipant = data.participants && data.participants.length > 1 ?
      data.participants.find((participant: User) => participant._id !== this.authenticationService.auth?.user._id) : null;
    this.selectedChatroomId = data.chatroomId;
  }

  participantUpdated(data: any): void {
    if (this.selectedChatroomId !== data.chatroomId) {
      this.selectedParticipant = data.user;
      this.selectedChatroomId = data.chatroomId;
      this.selectedChatroom = data.chatroom;
      this.router.navigate(['/chat', data.chatroomId]);
      // this.chatRoom?.selectChatroom(this.selectedChatroom);
    }
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

  backButtonSignal(data: boolean): void {
    if (data) {
      this.selectedChatroomId = null;
      this.selectedParticipant = null;
      this.selectedChatroom = null;
      this.chatRoom?.getAllChatRooms();
    }
  }

  async handleUserSearch(input: string): Promise<void> {
    if (input && input.length > 0) {
      this.showInitialList = false;
      await this.searchChatroom(input);
    } else {
      this.showInitialList = true;
    }
  }

  onSearchUserOrMessage(event: any): void {
    this.userInput$.next(event.target.value);
  }

  async searchChatroom(input: string): Promise<void> {
    const query = {
      search: input
    };
    const response = await this.chatroomService.searchChatrooms(query) as any;
    if (response && response.success) {
      this.matchedMessages = response.data.matchMessages;
      this.matchedUsers = response.data.matchUser;
      this.chatroomSearch!.matchedMessages = this.matchedMessages;
      this.chatroomSearch!.matchedUsers = this.matchedUsers;
    }
  } 
}