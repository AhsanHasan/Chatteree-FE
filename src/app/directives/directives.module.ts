import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsernameInputDirective } from './username-validation-input.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
        UsernameInputDirective
    ],
    exports: [
        UsernameInputDirective
    ]
})
export class DirectivesModule { }