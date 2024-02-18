import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()

export class ChatroomService {
    private GET_CHATROOM_ENDPOINT = '/chatroom';
    private GET_ALL_CHATROOM_ENDPOINT = '/chatroom/all';

    constructor(
        private http: HttpClient
    ) { }

    async getChatroom(query: any): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_CHATROOM_ENDPOINT, { params: query as any }));
    }

    async getAllChatrooms(query: PaginationQuery): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_ALL_CHATROOM_ENDPOINT, { params: query as any }));
    }
}

export interface PaginationQuery {
    page: number;
    limit: number;
    search?: string | null;
}