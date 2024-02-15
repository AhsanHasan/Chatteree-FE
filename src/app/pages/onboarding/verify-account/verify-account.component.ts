import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent {
  constructor(
    public authenticationService: AuthenticationService
  ) { }

  moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    if (currentInput.value.length === currentInput.maxLength) {
      nextInput.focus();
    }
  }
}
