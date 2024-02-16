import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class IsActiveGuard {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    async canActivate(): Promise<any> {
        if (this.authenticationService.auth && this.authenticationService.auth.user && this.authenticationService.auth.user.isActive && this.authenticationService.isUserLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/onboarding/verify-account']);
            return false;
        }
    }
}
