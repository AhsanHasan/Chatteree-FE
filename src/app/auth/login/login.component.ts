import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { AuthenticationService, UserEmail } from 'src/app/services/authentication.service';
import { Utils } from 'src/app/utils';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private angularAuth: AngularFireAuth,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onGoogleSignIn(): void {
    this.angularAuth.signInWithPopup(new GoogleAuthProvider()).then((userCredential) => {
      console.log(userCredential);
    }).catch((error) => {
      console.error(error);
    });
  }

  async onEmailSignIn(emailSignInForm: NgForm): Promise<void> {
    try {
      if (emailSignInForm.invalid) {
        return;
      }
      const body: UserEmail = {
        email: emailSignInForm.value.email,
      };
      const response = await this.authenticationService.authenticateWithEmail(body);
      if (response && response.success) {
        // Store session in cookie
        await this.authenticationService.storeSession(response.data);
        // Check if user is verified
        if (this.authenticationService.auth?.user?.isActive) {
          // Check if user has name
          if (this.authenticationService.auth?.user?.name) {
            // Check if user has profile picture
            if (this.authenticationService.auth?.user?.profilePicture) {
              // Redirect to chat
              this.router.navigate(['/chat']);
            } else {
              // Redirect to image upload
              this.router.navigate(['/onboarding/image-upload']);
            }
          } else {
            // Redirect to onboarding
            this.router.navigate(['/onboarding/set-username']);
          }
        } else {
          // Redirect to verify email
          this.router.navigate(['/onboarding/verify-account']);
        }
      }
    } catch (error) {
      Utils.showErrorMessage('Error signing in with email', error);
    }
  }

}
