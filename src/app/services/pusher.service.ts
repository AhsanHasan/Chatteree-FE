import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, lastValueFrom } from 'rxjs';
import Pusher from 'pusher-js';
import { isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environments';

@Injectable({
    providedIn: 'root'
})

export class PusherService {
    public messageSubject = new Subject<any>();
    public statusSubject = new Subject<any>();
    private pusherClient!: Pusher;
    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private authenticationService: AuthenticationService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.subscribeChatToChannel();
        }
    }

    subscribeChatToChannel(): void {
        if (isPlatformBrowser(this.platformId) && this.authenticationService.isUserLoggedIn()) {
            this.pusherClient = new Pusher(environment.pusher.key, { cluster: environment.pusher.cluster });
            const channelName = 'chat-room';
            const eventName = 'new-message';
            const channel = this.pusherClient.subscribe(channelName as any);
            channel.bind(eventName, (data: any) => { this.messageSubject.next(data); });
            channel.bind('new-status', (data: any) => { this.statusSubject.next(data); });
        }
    }
}