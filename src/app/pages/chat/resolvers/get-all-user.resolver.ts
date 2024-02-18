import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { UserService } from '../services/user.service';

export const GetAllUserResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const userService = inject(UserService);
    const page = 1;
    const limit = 6;
    const query = {
        page,
        limit
    };
    return from(userService.getAllUsers(query)).pipe(
        map((response: any) => {
            return response;
        }),
        catchError((error: any) => {
            return throwError(() => error);
        })
    );
};
