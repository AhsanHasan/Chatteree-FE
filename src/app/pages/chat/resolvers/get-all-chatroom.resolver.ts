import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';

export const GetAllChatroomResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatroomService = inject(ChatroomService);
    const page = 1;
    const limit = 10;
    const query = {
        page,
        limit
    };
    return from(chatroomService.getAllChatrooms(query)).pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error: any) => {
            return throwError(() => error);
        })
    );
};
