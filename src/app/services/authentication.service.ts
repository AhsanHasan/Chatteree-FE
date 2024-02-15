import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { environment } from 'src/environments/environments';
@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private AUTHENTICATE_WITH_EMAIL_ENDPOINT = '/authenticate';
    private AUTHENTICATE_WITH_GOOGLE_ENDPOINT = '/authenticate/google';
    private VERIFY_GOOGLE_TOKEN_ENDPOINT = '/authenticate/google/verify';
    private GET_USER_ENDPOINT = '/user';

    constructor(
        private http: HttpClient,
        private router: Router,
        private cookieService: SsrCookieService
    ) { }

    public auth: Session | undefined = {
        token: '',
        user: {
            _id: '',
            email: '',
            name: '',
            profilePicture: '',
            isActive: false,
            onlineStatus: false
        }
    };

    get authFromCookie(): Session | undefined {
        try {
            if (this.cookieService.get(environment.versionControl.env + environment.versionControl.v + 'SessionAuth') &&
                this.cookieService.get(environment.versionControl.env + environment.versionControl.v + 'SessionAuth') !== 'undefined') {
                const cookie = JSON.parse(decodeURIComponent(this.cookieService.get(environment.versionControl.env + environment.versionControl.v + 'SessionAuth')));
                if (cookie.user) {
                    return {
                        token: cookie.token,
                        user: {
                            _id: cookie.user._id,
                            email: cookie.user.email,
                            name: cookie.user.name,
                            profilePicture: cookie.user.profilePicture,
                            isActive: cookie.user.isActive,
                            onlineStatus: cookie.user.onlineStatus
                        }
                    };
                }
                this.cookieService.delete(
                    environment.versionControl.env + environment.versionControl.v + 'SessionAuth',
                    '/',
                    environment.cookieDomain,
                    true
                );
                return undefined;
            }
            this.cookieService.delete(
                environment.versionControl.env + environment.versionControl.v + 'SessionAuth',
                '/',
                environment.cookieDomain,
                true
            );
            return undefined;
        } catch (error) {
            this.cookieService.delete(
                environment.versionControl.env + environment.versionControl.v + 'SessionAuth',
                '/',
                environment.cookieDomain,
                true
            );
            return undefined;
        }
    }

    async authenticateWithEmail(body: UserEmail): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.AUTHENTICATE_WITH_EMAIL_ENDPOINT, body));
    }

    async authenticateWithGoogle(body: GoogleUser): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.AUTHENTICATE_WITH_GOOGLE_ENDPOINT, body));
    }

    async verifyGoogleToken(body: GoogleToken): Promise<any> {
        return await lastValueFrom(this.http.post<any>(environment.apiBase + this.VERIFY_GOOGLE_TOKEN_ENDPOINT, body));
    }

    async getUser(): Promise<any> {
        return await lastValueFrom(this.http.get<any>(environment.apiBase + this.GET_USER_ENDPOINT));
    }

    isUserLoggedIn(): boolean {
        return this.cookieService.check(environment.versionControl.env + environment.versionControl.v + 'SessionAuth');
    }

    async storeSession(data: Session): Promise<void> {
        if (data) {
            const encodeString = JSON.stringify({
                token: data.token || '',
                user: {
                    _id: data.user._id,
                    email: data.user.email,
                    name: data.user.name,
                    profilePicture: data.user.profilePicture,
                    isActive: data.user.isActive,
                    onlineStatus: data.user.onlineStatus
                }
            });
            const currentDate = new Date();
            const expDate = currentDate.setTime(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000));
            this.cookieService.set(
                `${environment.versionControl.env}${environment.versionControl.v}SessionAuth`,
                encodeString.toString(),
                expDate,
                '/',
                environment.cookieDomain,
                true
            )
            this.auth = this.authFromCookie;
            console.log(this.auth);
        } else {
            this.logout();
        }
    }

    logout(): void {
        this.cookieService.delete(
            environment.versionControl.env + environment.versionControl.v + 'SessionAuth',
            '/',
            environment.cookieDomain,
            true
        );
        this.router.navigate(['/']);
    }
}

export interface UserEmail {
    email: string;
}

export interface GoogleUser {
    email: string;
    name: string;
    profilePicture: string;
    verified_email: boolean;
}

export interface GoogleToken {
    idToken: string;
}

export interface Session {
    token: string;
    user: User;
}