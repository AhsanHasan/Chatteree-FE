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
    private VERIFY_GOOGLE_TOKEN_ENDPOINT = '/authenticate/google/token/verify';
    private GET_USER_ENDPOINT = '/user';
    private UPDATE_USER_ONLINE_STATUS_ENDPOINT = '/user/online-status';

    constructor(
        private http: HttpClient,
        private router: Router,
        private cookieService: SsrCookieService
    ) {
        const d = new Date();
        const expDate = d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
        // Setup blank cookie
        if (!this.cookieService.get(environment.versionControl.env + environment.versionControl.v + 'SessionAuth')) {
            this.cookieService.set(
                environment.versionControl.env + environment.versionControl.v + 'SessionAuth',
                'undefined',
                expDate,
                '/',
                environment.cookieDomain,
                true
            );
        }
    }

    get auth() {
        return this.authFromCookie;
    }

    set auth(data: Session | undefined) {
        this.auth = data;
    }

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
                            username: cookie.user.username,
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

    async validateGoogleToken(body: GoogleToken): Promise<any> {
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
                    username: data.user.username,
                    profilePicture: data.user.profilePicture,
                    isActive: data.user.isActive,
                    onlineStatus: data.user.onlineStatus
                }
            });
            const currentDate = new Date();
            // Calculate expiration date by adding milliseconds equivalent to 1 day
            const expDate = new Date(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000));
            this.cookieService.set(
                `${environment.versionControl.env}${environment.versionControl.v}SessionAuth`,
                encodeString.toString(),
                expDate,
                '/',
                environment.cookieDomain,
                false
            )
        } else {
            this.logout();
        }
    }

    async setToken(token: string): Promise<void> {
        // Add token to the cookies
        const encodeString = JSON.stringify({
            token: token,
            user: {
                _id: this.auth?.user._id,
                email: this.auth?.user.email,
                name: this.auth?.user.name,
                profilePicture: this.auth?.user.profilePicture,
                isActive: true,
                onlineStatus: this.auth?.user.onlineStatus
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
            false
        )
    }

    async setUserData(user: User): Promise<void> {
        // Add user data to the cookies
        const encodeString = JSON.stringify({
            token: this.auth?.token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                username: user.username,
                profilePicture: user.profilePicture,
                isActive: user.isActive,
                onlineStatus: user.onlineStatus
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
            false
        )
    }

    async storeDeviceInformation(isMobileDevice: boolean): Promise<void> {
        // Store device information in the cookies
        const encodeString = JSON.stringify({
            isMobile: isMobileDevice
        })
        // Store cookie for 30 days
        const currentDate = new Date();
        const expDate = currentDate.setTime(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        this.cookieService.set(
            `${environment.versionControl.env}${environment.versionControl.v}Device`,
            encodeString.toString(),
            expDate,
            '/',
            environment.cookieDomain,
            false
        )
    }

    getDeviceInformation(): any {
        // Get device information from the cookies
        const deviceInformation = this.cookieService.get(`${environment.versionControl.env}${environment.versionControl.v}Device`);
        if (deviceInformation) {
            return JSON.parse(decodeURIComponent(deviceInformation));
        }
        return undefined;
    }

    async logout(): Promise<void> {
        this.cookieService.deleteAll('/', environment.cookieDomain);
        this.router.navigate(['/']);
    }

    async updateUserOnlineStatus(): Promise<void> {
        return await lastValueFrom(this.http.put<any>(environment.apiBase + this.UPDATE_USER_ONLINE_STATUS_ENDPOINT, null));
    }
}

export interface UserEmail {
    email: string;
}

export interface GoogleUser {
    email: string;
    name: string;
    profilePicture: string;
    verifiedEmail: boolean;
}

export interface GoogleToken {
    idToken: string;
}

export interface Session {
    token: string;
    user: User;
}