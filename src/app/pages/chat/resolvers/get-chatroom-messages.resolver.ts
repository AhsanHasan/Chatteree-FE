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
    const chatroomId = route.params['id'];
    const isSearchQuery = route.queryParams['search'] ? true : false;
    const messageId = route.queryParams['search'] ? route.queryParams['search'] : null;
    const query: any = {
        chatroomId,
        messageType: 'old',
        limit: isSearchQuery ? 20 : 10
    };
    if (isSearchQuery) {
        query['messageId'] = messageId;
        query['isSearchQuery'] = isSearchQuery;
    }
    return from(messageService.getChatroomMessages(query)).pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error: any) => {
            return throwError(() => error);
        })
    );
};
