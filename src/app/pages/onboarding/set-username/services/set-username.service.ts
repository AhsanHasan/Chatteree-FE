import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()

export class SetUsernameService {
    private SAVE_USERNAME_ENDPOINT = '/user/username';

    constructor(
        private http: HttpClient
    ) { }

    async saveUsername(body: SaveUsernameBody): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.SAVE_USERNAME_ENDPOINT, body));
    }
}

export interface SaveUsernameBody {
    username: string;
    userId: string;
}
