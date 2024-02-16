import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appUsernameInput]'
})
export class UsernameInputDirective {

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInput(event: any) {
        const inputValue = this.el.nativeElement.value;
        const filteredValue = inputValue.replace(/[^a-z0-9]/g, '');

        this.el.nativeElement.value = filteredValue;
    }
}
