import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoPreviewModalService {

    private vidModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.vidModalVisibilitySubject.asObservable();

    private videoURLSource = new BehaviorSubject<string | null>(null);
    videoURLObservable = this.videoURLSource.asObservable();

    videoURL = '';
    filename = '';

    togglePopup(): void {
        this.vidModalVisibilitySubject.next(!this.vidModalVisibilitySubject.value);
    }

    setVideoURL(url: string) {
        this.videoURLSource.next(url);
    }
}
