import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { resendOTPBody } from '../verify-account.component';
import { environment } from 'src/environments/environments';

@Injectable()

export class VerifyAccountService {
    private RESEND_OTP_ENDPOINT = '/authenticate/email/resend-otp';
    private VERIFY_OTP_ENDPOINT = '/authenticate/email/verify';

    constructor(
        private http: HttpClient
    ) { }

    async resendOTP(body: resendOTPBody): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.RESEND_OTP_ENDPOINT, body));
    }

    async verifyOTP(body: any): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.VERIFY_OTP_ENDPOINT, body));
    }
}