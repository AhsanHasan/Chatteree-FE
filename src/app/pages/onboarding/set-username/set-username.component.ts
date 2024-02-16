import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SaveUsernameBody, SetUsernameService } from './services/set-username.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Utils } from 'src/app/utils';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-set-username',
  templateUrl: './set-username.component.html',
  styleUrls: ['./set-username.component.css']
})
export class SetUsernameComponent implements AfterViewInit {
  public spinner = 'usernameSpinner'
  public isSpinnerVisible = false;
  public showStatusIcon = false;
  usernameChange$: Subject<string> = new Subject<string>();
  public usernameFormError: UsernameFormError = {
    isValid: true,
    message: ''
  };
  constructor(
    private authenticationService: AuthenticationService,
    private setUsernameService: SetUsernameService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    /* this.ngxSpinnerService.show(this.spinner);
    this.isSpinnerVisible = true;
    setTimeout(() => {
      this.ngxSpinnerService.hide(this.spinner);
      this.isSpinnerVisible = false;
    }, 5000); */
  }

  async saveUsername(usernameForm: NgForm) {
    try {
      if (usernameForm.invalid) {
        return;
      }
      const username = usernameForm.value.username;
      // Check if username entered has size greater than equal to 9 and less than equal to 15
      if (username.length < 9 || username.length > 15) {
        this.usernameFormError = {
          isValid: false,
          message: 'Username should be between 9 and 15 characters'
        };
        return;
      }
      const body = {
        userId: this.authenticationService.auth?.user._id,
        username
      } as SaveUsernameBody;
      this.ngxSpinnerService.show(this.spinner);
      this.isSpinnerVisible = true;
      const response = await this.setUsernameService.saveUsername(body);
      if (response.success) {
        this.showStatusIcon = true;
        await this.authenticationService.setUserData({
          username,
          name: this.authenticationService.auth?.user.name,
          email: this.authenticationService.auth?.user.email ?? '',
          profilePicture: this.authenticationService.auth?.user.profilePicture ?? '',
          isActive: this.authenticationService.auth?.user.isActive ?? true,
          onlineStatus: this.authenticationService.auth?.user.onlineStatus ?? false,
        });
        this.usernameFormError = {
          isValid: true,
          message: ''
        };
        setTimeout(() => {
          this.router.navigate(['/onboarding/basic-information']);
        }, 2000);
      } else {
        this.showStatusIcon = true;
        this.usernameFormError = {
          isValid: false,
          message: response.message
        };
      }

    } catch (error) {
      Utils.showErrorMessage('Failed to save username. Please try again.', error);
    }
    this.ngxSpinnerService.hide(this.spinner);
    this.isSpinnerVisible = false;
  }

}

export interface UsernameFormError {
  isValid: boolean;
  message: string;
}