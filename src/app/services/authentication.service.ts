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
    private LOGOUT_ENDPOINT = '/authenticate/logout';

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
            const expDate = currentDate.setTime(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000));
            this.cookieService.set(
                `${environment.versionControl.env}${environment.versionControl.v}SessionAuth`,
                encodeString.toString(),
                expDate,
                '/',
                environment.cookieDomain,
                true
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
            true
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
            true
        )
    }

    async logout(): Promise<void> {
        try {
            await lastValueFrom(this.http.post<any>(environment.apiBase + this.LOGOUT_ENDPOINT, {}));
        } catch (error) {
            console.error('Error logging out:', error);
            throw error; // re-throw the error if you want it to be caught by calling code
        }

        try {
            this.cookieService.delete(
                environment.versionControl.env + environment.versionControl.v + 'SessionAuth',
                '/',
                environment.cookieDomain,
                true
            );
        } catch (error) {
            console.error('Error deleting cookie:', error);
            throw error; // re-throw the error if you want it to be caught by calling code
        }

        try {
            this.router.navigate(['/']);
        } catch (error) {
            console.error('Error navigating:', error);
            throw error; // re-throw the error if you want it to be caught by calling code
        }
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