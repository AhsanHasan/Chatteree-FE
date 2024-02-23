import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()

export class StatusService {
    private CREATE_STATUS_ENPOINT = '/status';
    private GET_STATUS_ENPOINT = '/status';
    private VIEW_STATUS_ENDPOINT = '/status/view';

    constructor(
        private http: HttpClient
    ) { }

    async getAllStatus(query: any): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_STATUS_ENPOINT, { params: query as any }));
    }

    async createStatus(data: any): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.CREATE_STATUS_ENPOINT, data));
    }

    async viewStatus(data: any): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.VIEW_STATUS_ENDPOINT, data));
    }

}