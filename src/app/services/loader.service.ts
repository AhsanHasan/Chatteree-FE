import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private myValueSubject = new BehaviorSubject<string>('Loading...');
    myValue$ = this.myValueSubject.asObservable();

    updateValue(newValue: string) {
        this.myValueSubject.next(newValue);
    }
}