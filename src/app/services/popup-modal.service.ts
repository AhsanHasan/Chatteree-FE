import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PopupModalService {

    private popupModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.popupModalVisibilitySubject.asObservable();

    togglePopup(): void {
        this.popupModalVisibilitySubject.next(!this.popupModalVisibilitySubject.value);
    }
}
