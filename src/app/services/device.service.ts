import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    constructor(
        private deviceService: DeviceDetectorService,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    get isMobile() {
        if (isPlatformBrowser(this.platformId)) {
            return this.deviceService.isMobile();
        }
        return false;
    }

}