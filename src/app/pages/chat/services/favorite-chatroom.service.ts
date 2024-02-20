import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()

export class FavoriteChatroomService {
    private GET_FAV_CHATROOM_ENDPOINT = '/favorite-chatroom';
    private TOGGLE_FAV_CHATROOM_ENDPOINT = '/favorite-chatroom';

    constructor(
        private http: HttpClient
    ) { }

    async toggleFavoriteChatroom(body: any): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.TOGGLE_FAV_CHATROOM_ENDPOINT, body));
    }

    async getAllFavoriteChatrooms(): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_FAV_CHATROOM_ENDPOINT));
    }
}