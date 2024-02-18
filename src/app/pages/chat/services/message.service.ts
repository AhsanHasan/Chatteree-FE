import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()

export class MessageService {
    private GET_CHATROOM_MESSAGES = '/message/all';
    private SEND_MESSAGE = '/message';

    constructor(
        private http: HttpClient
    ) { }

    async getChatroomMessages(query: any): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_CHATROOM_MESSAGES, { params: query as any }));
    }

    async sendMessage(data: any): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.SEND_MESSAGE, data));
    }

}