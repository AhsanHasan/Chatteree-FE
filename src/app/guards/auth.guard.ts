import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    async canActivate(): Promise<any> {
        debugger;
        if (this.authenticationService.isUserLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
