import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuard {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
    ) { }

    async canActivate(): Promise<any> {
        if (this.authenticationService.isUserLoggedIn()) {
            if (this.authenticationService.auth?.user?.isActive) {
                if (this.authenticationService.auth?.user?.name) {
                    if (this.authenticationService.auth?.user?.profilePicture) {
                        this.router.navigate(['/chat']);
                    } else {
                        this.router.navigate(['/onboarding/image-upload']);
                    }
                } else {
                    this.router.navigate(['/onboarding/set-username']);
                }
            } else {
                this.router.navigate(['/onboarding/verify-account']);
            }
        } else {
            return true;
        }
    }
}
