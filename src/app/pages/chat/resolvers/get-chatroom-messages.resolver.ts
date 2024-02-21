import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { MessageService } from '../services/message.service';

export const GetAllMessageResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const messageService = inject(MessageService);
    const page = 1;
    const limit = 10;
    const chatroomId = route.params['id'];
    const query = {
        page,
        limit,
        chatroomId
    };
    return from(messageService.getChatroomMessages(query)).pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error: any) => {
            return throwError(() => error);
        })
    );
};
