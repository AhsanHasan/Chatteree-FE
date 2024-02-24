import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ChatroomService, PaginationQuery } from 'src/app/pages/chat/services/chatroom.service';
import { SearchPeopleService } from 'src/app/pages/chat/services/search-people.service';
import { UserService } from 'src/app/pages/chat/services/user.service';
import { DeviceService } from 'src/app/services/device.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent implements OnInit, OnChanges {
  @Input() users: any;
  @Input() pagination: any;
  @Output() chatRoomSelected: EventEmitter<any> = new EventEmitter<any>();
  searchTerm: string = '';
  searchTermChanged = new Subject<string>();

  spinner = 'searchPeopleSpinner';
  constructor(
    private searchPeopleService: SearchPeopleService,
    private userService: UserService,
    private chatroomService: ChatroomService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
    private deviceService: DeviceService
  ) {
    this.searchTermChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(async (searchTerm) => {
      try {
        const query = {
          page: 1,
          limit: 6,
          search: searchTerm
        } as PaginationQuery;
        await this.getSearchedUsers(query);
      } catch (error) {
        Utils.showErrorMessage('Failed to search users', error);
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get poupModalVisibility$(): any {
    return this.searchPeopleService.modalVisibility$;
  }

  closePopup(): void {
    this.searchPeopleService.togglePopup();
  }

  async onScroll(): Promise<void> {
    const query = {
      page: this.pagination.hasNextPage ? parseInt(this.pagination.currentPage, 10) + 1 : 1,
      limit: 6,
      search: this.searchTerm || null
    } as PaginationQuery;
    await this.getAllUsers(query);
  }

  async getAllUsers(query: PaginationQuery | null): Promise<void> {
    try {
      this.ngxSpinnerService.show(this.spinner);
      const response = await this.userService.getAllUsers(query as PaginationQuery);
      if (response) {
        this.users = this.users.concat(response.data.users);
        this.pagination = response.data.pagination;
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to get users', error);
    }
    this.ngxSpinnerService.hide(this.spinner);
  }
  async getSearchedUsers(query: PaginationQuery | null): Promise<void> {
    try {
      this.ngxSpinnerService.show(this.spinner);
      const response = await this.userService.getAllUsers(query as PaginationQuery);
      if (response) {
        this.users = response.data.users;
        this.pagination = response.data.pagination;
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to get users', error);
    }
    this.ngxSpinnerService.hide(this.spinner);
  }

  onSearch(event: any) {
    this.searchTermChanged.next(event.target.value);
  }

  async getChatRoom(user: any): Promise<void> {
    try {
      this.ngxSpinnerService.show(this.spinner);
      const query = {
        userId: user._id
      };
      const response = await this.chatroomService.getChatroom(query);
      if (response.success) {
        // set chat room id in query params
        this.chatRoomSelected.emit({ participants: response.data.participants, chatroomId: response.data._id });
        debugger;
        if (!this.deviceService.isMobile) {
          this.router.navigate(['/chat', response.data._id]);

        } else {
          this.router.navigate(['/m-chat', response.data._id])
        }
        this.closePopup();
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to create chat room', error);
    }
    this.ngxSpinnerService.hide(this.spinner);
  }

}
