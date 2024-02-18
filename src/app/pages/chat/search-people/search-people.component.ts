import { Component, Input, OnInit } from '@angular/core';
import { SearchPeopleService } from '../services/search-people.service';
import { PaginationQuery, UserService } from '../services/user.service';
import { Utils } from 'src/app/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, debounce, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent implements OnInit {
  @Input() users: any;
  @Input() pagination: any;

  searchTerm: string = '';
  searchTermChanged = new Subject<string>();

  spinner = 'searchPeopleSpinner';

  constructor(
    private searchPeopleService: SearchPeopleService,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService
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
}
