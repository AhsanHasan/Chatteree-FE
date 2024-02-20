import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AttachmentService {
    public attachmentData: any;
    private attachmentModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.attachmentModalVisibilitySubject.asObservable();

    togglePopup(): void {
        this.attachmentModalVisibilitySubject.next(!this.attachmentModalVisibilitySubject.value);
    }

    removeAttachment(): void {
        
    }
}
