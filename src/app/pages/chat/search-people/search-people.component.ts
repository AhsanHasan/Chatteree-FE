import { Component, OnInit } from '@angular/core';
import { SearchPeopleService } from '../services/search-people.service';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent implements OnInit {
  constructor(
    private searchPeopleService: SearchPeopleService
  ) { }

  ngOnInit(): void {
  }

  get poupModalVisibility$(): any {
    return this.searchPeopleService.modalVisibility$;
  }

  closePopup(): void {
    this.searchPeopleService.togglePopup();
  }
}
