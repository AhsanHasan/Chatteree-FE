import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserDetailsModalService {

    private userDetailsModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.userDetailsModalVisibilitySubject.asObservable();

    togglePopup(): void {
        this.userDetailsModalVisibilitySubject.next(!this.userDetailsModalVisibilitySubject.value);
    }
}
