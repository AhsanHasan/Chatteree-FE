import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { DeviceService } from '../services/device.service';

@Injectable({
    providedIn: 'root'
})
export class IsCompletedProfileGuard {
    constructor(
        private authenticationService: AuthenticationService,
        private deviceService: DeviceService,
        private router: Router
    ) { }

    async canActivate(): Promise<any> {
        if (this.authenticationService.auth && this.authenticationService.auth.user
            && this.authenticationService.auth.user.isActive
            && this.authenticationService.isUserLoggedIn()
            && this.authenticationService.auth.user.profilePicture && this.authenticationService.auth.user.profilePicture !== ''
            && this.authenticationService.auth.user.name && this.authenticationService.auth.user.name !== '') {
            if (this.deviceService.isMobile) {
                this.router.navigate(['/m-chat']);
            } else {
                this.router.navigate(['/chat']);
            }
            return false;
        } else {
            return true;
        }
    }
}
