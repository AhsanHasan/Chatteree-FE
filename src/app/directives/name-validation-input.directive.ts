import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appNameInput]'
})
export class NameInputDirective {

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInput(event: any) {
        const inputValue = this.el.nativeElement.value;
        const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

        this.el.nativeElement.value = filteredValue;
    }
}
