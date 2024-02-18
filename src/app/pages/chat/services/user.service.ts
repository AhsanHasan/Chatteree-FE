import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()

export class UserService {
    private GET_ALL_USER_ENDPOINT = '/user/all';

    constructor(
        private http: HttpClient
    ) { }

    async getAllUsers(query: PaginationQuery): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_ALL_USER_ENDPOINT, { params: query as any }));
    }
}

export interface PaginationQuery {
    page: number;
    limit: number;
    search?: string | null;
}