import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ViewStatusPopupService {

    private viewStatusVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.viewStatusVisibilitySubject.asObservable();

    private statusData = new BehaviorSubject<any | null>(null);
    statusObservable = this.statusData.asObservable();

    togglePopup(): void {
        this.viewStatusVisibilitySubject.next(!this.viewStatusVisibilitySubject.value);
    }

    setStatus(data: any | null) {
        this.statusData.next(data);
    }
}
