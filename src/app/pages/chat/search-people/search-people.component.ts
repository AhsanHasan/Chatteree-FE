import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchPeopleService } from '../services/search-people.service';
import { PaginationQuery, UserService } from '../services/user.service';
import { Utils } from 'src/app/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounce, debounceTime, distinctUntilChanged } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent implements OnInit {
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
    private router: Router
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
        await this.getAllUsers(query);
      } catch (error) {
        Utils.showErrorMessage('Failed to search users', error);
      }
    });
  }

  ngOnInit(): void {
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
        this.router.navigate(['/chat', response.data._id]);
        this.closePopup();
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to create chat room', error);
    }
    this.ngxSpinnerService.hide(this.spinner);
  }
}
