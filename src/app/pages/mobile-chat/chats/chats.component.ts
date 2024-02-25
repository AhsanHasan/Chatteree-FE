import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Chatroom } from '../../chat/interfaces/chatroom.interface';
import { User } from 'src/app/interfaces/user';
import { Pagination } from 'src/app/interfaces/pagination.interface';
import { ChatroomService, PaginationQuery } from '../../chat/services/chatroom.service';
import { SearchPeopleService } from '../../chat/services/search-people.service';
import { ChatSearchComponent } from 'src/app/shared/chat-search/chat-search.component';
import { Subject, debounceTime } from 'rxjs';
import { PreviewModalService } from 'src/app/shared/preview-modal/preview-modal.service';
import { ViewStatusPopupService } from 'src/app/shared/view-status-popup/view-status-popup.service';
import { Utils } from 'src/app/utils';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  @ViewChild('chatroomSearch') chatroomSearch: ChatSearchComponent | undefined;
  userInput$ = new Subject<string>();
  searchInput = '';
  showInitialList = true;
  slides: any = [];
  slideConfig = {
    'slidesToShow': 3,
    'slidesToScroll': 1,
    'arrows': false,
    'variableWidth': true,
    'infinite': true,
    'centerMode': false,
    'autoplay': false,
    'draggable': true,
    'adaptiveHeight': true,
  };

  statuses: any = [];

  chatrooms: Array<Chatroom> = [];
  dropdownOpen = false;
  users: Array<User> = [];
  selectedParticipant: User | null | undefined = null;
  selectedChatroomId: string | null = null;
  selectedChatroom: any;

  matchedUsers: Array<User> = [];
  matchedMessages: Array<any> = [];

  selectedStatus: any;
  pagination: Pagination = {
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  constructor(
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private chatroomService: ChatroomService,
    private router: Router,
    private searchPeopleService: SearchPeopleService,
    private previewModalService: PreviewModalService,
    private viewStatusPopupService: ViewStatusPopupService,
    private statusService: StatusService,
    private cd: ChangeDetectorRef
  ) {
    this.route.data.subscribe((data: any) => {
      this.chatrooms = data.chatrooms.data.chatRooms;
      this.users = data.users.data.users;
      this.statuses = data.status.data;
    });

    this.userInput$.pipe(debounceTime(500)).subscribe((input: string) => {
      this.handleUserSearch(input);
    });
  }

  slickInit(e: any) {
    // console.log('slick initialized');
  }

  selectChatroom(chatroom: Chatroom): void {
    this.router.navigate([`/m-chat/${chatroom._id}`]);
  }

  async chatRoomSelected(data: any): Promise<void> {
    await this.getAllChatRooms();
    this.selectedParticipant = data.participants && data.participants.length > 1 ?
      data.participants.find((participant: User) => participant._id !== this.authenticationService.auth?.user._id) : null;
    this.selectedChatroomId = data.chatroomId;
  }

  async getAllChatRooms(page = 1, limit = 10): Promise<void> {
    try {
      const query = {
        page,
        limit
      } as PaginationQuery;
      const response = await this.chatroomService.getAllChatrooms(query);
      if (response && response.success) {
        this.chatrooms = response.data.chatRooms;
      }
    } catch (error) {
      console.error('Failed to get chat rooms', error);
    }
  }

  openSearchPeopleModal(): void {
    this.searchPeopleService.togglePopup();
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
  participantUpdated(data: any): void {
    this.router.navigate(['/m-chat', data.chatroomId]);
  }

  handleFileInput(event: any): void {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 5242880) {
        alert('File size should not exceed 5MB');
        return;
      }
      // Convert video file to ObjectURL
      const blob = new Blob([event.target.files[0]], { type: event.target.files[0].type });
      const videoUrl = URL.createObjectURL(blob);
      this.previewModalService.file = event.target.files[0];
      this.previewModalService.setImageURL(videoUrl);
      this.previewModalService.filename = event.target.files[0].name;
      this.previewModalService.togglePopup();
      this.cd.detectChanges();

    }
  }

  viewStatus(status: any): void {
    let statusMedia = status.statuses;
    // Iterate status media and check if the status is viewed by the user, if not, push it at the beginning of the array
    statusMedia = statusMedia.map((media: any) => {
      if (media.viewed) {
        return media;
      }
      return media;
    });
    status.statuses = statusMedia;
    this.viewStatusPopupService.setStatus(status);
    this.viewStatusPopupService.togglePopup();
  }

  async statusUploadSignal(data: any): Promise<void> {
    await this.getAllStatus();
  }

  async getAllStatus(): Promise<void> {
    try {
      let response = await this.statusService.getAllStatus();
      if (response && response.success) {
        this.statuses = response.data;
      }
    } catch (error) {
      Utils.showErrorMessage('Error getting status', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authenticationService.logout();
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }
}
