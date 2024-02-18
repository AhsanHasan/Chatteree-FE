import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SearchPeopleService {

    private searchModalVisibilitySubject = new BehaviorSubject<boolean>(false);
    modalVisibility$ = this.searchModalVisibilitySubject.asObservable();

    togglePopup(): void {
        this.searchModalVisibilitySubject.next(!this.searchModalVisibilitySubject.value);
    }
}
