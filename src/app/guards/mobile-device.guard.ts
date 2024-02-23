import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DeviceService } from '../services/device.service';

@Injectable({
    providedIn: 'root'
})
export class MobileDeviceGuard {
    constructor(
        private router: Router,
        private deviceService: DeviceService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.deviceService.isMobile) {
            return true;
        } else {
            this.router.navigate(['/404']);
            return false;
        }
    }
}
