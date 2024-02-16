import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CropperModalService {

    private cropperModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.cropperModalVisibilitySubject.asObservable();

    togglePopup(): void {
        this.cropperModalVisibilitySubject.next(!this.cropperModalVisibilitySubject.value);
    }
}
