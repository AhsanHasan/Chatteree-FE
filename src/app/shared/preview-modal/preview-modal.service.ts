import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PreviewModalService {

    private previewModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.previewModalVisibilitySubject.asObservable();

    private previewURLSource = new BehaviorSubject<string | null>(null);
    previewURLObservable = this.previewURLSource.asObservable();

    imageURL = '';
    filename = '';
    file: File | null = null;

    togglePopup(): void {
        this.previewModalVisibilitySubject.next(!this.previewModalVisibilitySubject.value);
    }

    setImageURL(url: string) {
        this.previewURLSource.next(url);
    }
}
