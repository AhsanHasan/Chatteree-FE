import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsernameInputDirective } from './username-validation-input.directive';
import { NameInputDirective } from './name-validation-input.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
        UsernameInputDirective,
        NameInputDirective
    ],
    exports: [
        UsernameInputDirective,
        NameInputDirective
    ]
})
export class DirectivesModule { }