import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    constructor(
        private deviceService: DeviceDetectorService,
        private authenticationService: AuthenticationService,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    get isMobile() {
        const deviceInfo = this.authenticationService.getDeviceInformation();
        return deviceInfo && deviceInfo.hasOwnProperty('isMobile') ? deviceInfo.isMobile : false;
    }

}