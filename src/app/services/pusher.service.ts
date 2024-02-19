import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, lastValueFrom } from 'rxjs';
import { NgxPusherService } from 'ngx-pusher';

@Injectable({
    providedIn: 'root'
})

export class PusherService {
    public messageSubject = new Subject<any>();

    constructor(
        private pusherService: NgxPusherService
    ) { 
        this.subscribeChatToChannel();
    }

    subscribeChatToChannel(): void {
        const channelName = 'chat-room';
        const eventName = 'new-message';
        const channel = this.pusherService.listen(eventName, channelName);
        channel.subscribe((data: any) => {
            this.messageSubject.next(data);
        });
    }
}