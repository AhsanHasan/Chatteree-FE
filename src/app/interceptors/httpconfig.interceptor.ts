import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.auth && this.authenticationService.auth.token && request.url.indexOf(environment.apiBase) !== -1) {
            request = request.clone({ 
                setHeaders: { 
                    Authorization: `Bearer ${this.authenticationService.auth.token}` 
                } 
            });
        }
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                let message = '';
                if (error.error && error.error.message) {
                    message = error.error.message;
                }
                if (error.status === 401 && message === 'Token has expired') {
                    this.authenticationService.logout();
                    this.router.navigate(['/'], { queryParams: { login: 'show' } });
                }
                return throwError(error);
            }),
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.body.status_code && event.body.status_code === 401) {
                        this.authenticationService.logout();
                    }
                }
                return event;
            })
        );
    }
}