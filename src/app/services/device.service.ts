import { Inject, Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    constructor(
        private deviceService: DeviceDetectorService,
    ) { }

    get isMobile() {
        return this.deviceService.isMobile();
    }

}