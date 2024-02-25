import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, UserEmail } from 'src/app/services/authentication.service';
import { DeviceService } from 'src/app/services/device.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PusherService } from 'src/app/services/pusher.service';
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
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    private loaderService: LoaderService,
    private pusherService: PusherService,
    private deviceService: DeviceService,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
  }

  async onGoogleSignIn(): Promise<void> {
    try {
      const userCredential = await this.angularAuth.signInWithPopup(new GoogleAuthProvider()) as any;
      const body = {
        idToken: userCredential.credential?.idToken
      };
      this.loaderService.updateValue('Validating your details...');
      this.ngxSpinner.show();
      const validateToken = await this.authenticationService.validateGoogleToken(body);
      if (validateToken && validateToken.success) {
        const authBody = {
          email: userCredential.additionalUserInfo?.profile?.email,
          name: userCredential.additionalUserInfo?.profile?.name,
          profilePicture: userCredential.additionalUserInfo?.profile?.picture,
          verifiedEmail: userCredential.additionalUserInfo?.profile?.verified_email,
        };
        this.loaderService.updateValue('Signing in...');
        const response = await this.authenticationService.authenticateWithGoogle(authBody);
        if (response && response.success) {
          await this.authenticationService.storeSession(response.data);
          if (this.authenticationService.auth?.user?.isActive) {
            if (this.authenticationService.auth?.user?.username) {
              if (this.authenticationService.auth?.user?.profilePicture) {
                await this.pusherService.subscribeChatToChannel();
                if (!this.deviceService.isMobile) {
                  this.router.navigate(['/chat']);
                } else {
                  this.router.navigate(['/m-chat']);
                }
              } else {
                this.router.navigate(['/onboarding/basic-information']);
              }
            } else {
              this.router.navigate(['/onboarding/set-username']);
            }
          } else {
            this.router.navigate(['/onboarding/verify-account']);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    this.ngxSpinner.hide();
  }

  async onEmailSignIn(emailSignInForm: NgForm): Promise<void> {
    try {
      if (emailSignInForm.invalid) {
        return;
      }
      const body: UserEmail = {
        email: emailSignInForm.value.email,
      };
      this.loaderService.updateValue('Signing in...');
      this.ngxSpinner.show();
      const response = await this.authenticationService.authenticateWithEmail(body);
      if (response && response.success) {
        // Store session in cookie
        await this.authenticationService.storeSession(response.data);
        await this.authenticationService.storeDeviceInformation(this.deviceDetectorService.isMobile());
        // Check if user is verified
        if (this.authenticationService.auth?.user?.isActive) {
          // Check if user has name
          if (this.authenticationService.auth?.user?.username) {
            // Check if user has profile picture
            if (this.authenticationService.auth?.user?.profilePicture) {
              await this.pusherService.subscribeChatToChannel();
              // Redirect to chat
              if (!this.deviceService.isMobile) {
                this.router.navigate(['/chat']);
              } else {
                this.router.navigate(['/m-chat']);
              }
            } else {
              // Redirect to image upload
              this.router.navigate(['/onboarding/basic-information']);
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
    this.ngxSpinner.hide();
  }

}
