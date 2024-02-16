import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SetUsernameService } from './services/set-username.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-set-username',
  templateUrl: './set-username.component.html',
  styleUrls: ['./set-username.component.css']
})
export class SetUsernameComponent {

  constructor(
    private authenticationService: AuthenticationService,
    private setUsernameService: SetUsernameService,
    private ngxSpinnerService: NgxSpinnerService
  ) { }

  async saveUsername(usernameForm: NgForm) {
    try {
      if (usernameForm.invalid) {
        return;
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to save username. Please try again.', error);
    }
  }
}
