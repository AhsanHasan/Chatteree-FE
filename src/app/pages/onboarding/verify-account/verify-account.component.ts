import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Utils } from 'src/app/utils';
import { VerifyAccountService } from './services/verify-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent {
  userEnteredOTP: string | undefined = '';
  constructor(
    public authenticationService: AuthenticationService,
    private verifyAccountService: VerifyAccountService,
    private loaderService: LoaderService,
    private ngxSpinnerService: NgxSpinnerService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    if (currentInput.value.length === currentInput.maxLength) {
      nextInput.focus();
    }
  }

  async verifyOTP(form: NgForm): Promise<void> {
    try {
      if (form.invalid) {
        return;
      }
      this.loaderService.updateValue('Verifying OTP...');
      this.ngxSpinnerService.show();
      this.userEnteredOTP = form.value.otpInput1 + form.value.otpInput2 + form.value.otpInput3 + form.value.otpInput4 + form.value.otpInput5 + form.value.otpInput6;
      const body = {
        userId: this.authenticationService.auth?.user._id,
        otp: this.userEnteredOTP
      }
      const response = await this.verifyAccountService.verifyOTP(body);
      if (response.success) {
        // Add token to the cookies
        await this.authenticationService.setToken(response.data.token);
        this.router.navigate(['/onboarding/set-username']);
      } else {
        this.notifierService.notify('error', 'Incorrect confirmation code.');
      }
      form.reset();
    } catch (error) {
      Utils.showErrorMessage('Failed to verify OTP', error);
    }
    this.ngxSpinnerService.hide();
  }

  async resendOTP($event: MouseEvent): Promise<void> {
    $event.preventDefault();
    try {
      this.loaderService.updateValue('Resending OTP...');
      this.ngxSpinnerService.show();
      const body: resendOTPBody = {
        userId: this.authenticationService.auth?.user._id
      }
      const response = await this.verifyAccountService.resendOTP(body);
      if (response.success) {
        this.notifierService.notify('success', 'OTP sent successfully');
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to resend OTP', error);
      this.notifierService.notify('error', 'Failed to resend OTP');
    }
    this.ngxSpinnerService.hide();
  }

  signOut($event: MouseEvent): void {
    $event.preventDefault();
    this.authenticationService.logout();
  }
}

export interface resendOTPBody {
  userId: string | undefined;
}