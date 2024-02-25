import { Component } from '@angular/core';
import { UserDetailsModalService } from './user-details.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  public user: User | undefined;
  constructor(
    private userDetailsModalService: UserDetailsModalService
  ) {}

  get poupModalVisibility$(): any {
    return this.userDetailsModalService.modalVisibility$;
  }

  closePopup(): void {
    this.userDetailsModalService.togglePopup();
  }
}
