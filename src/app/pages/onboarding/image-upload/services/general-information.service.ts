import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';
import { UserInformation } from '../image-upload.component';

@Injectable()

export class GeneralInformationService {
    private SAVE_GENERAL_INFORMATION_ENDPOINT = '/user/general-information';

    constructor(
        private http: HttpClient
    ) { }

    async saveUsername(body: UserInformation): Promise<any> {
        return await lastValueFrom(this.http.put<any>(environment.apiBase + this.SAVE_GENERAL_INFORMATION_ENDPOINT, body));
    }
}
