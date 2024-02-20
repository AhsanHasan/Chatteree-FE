import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';
import { FavoriteChatroomService } from '../services/favorite-chatroom.service';

export const GetAllFavoriteChatroomResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const favoriteChatroomService = inject(FavoriteChatroomService);
    return from(favoriteChatroomService.getAllFavoriteChatrooms()).pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error: any) => {
            return throwError(() => error);
        })
    );
};
