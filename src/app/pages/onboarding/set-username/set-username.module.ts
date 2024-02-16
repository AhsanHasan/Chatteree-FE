import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetUsernameComponent } from './set-username.component';
import { SetUsernameRoutingModule } from './set-username-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DirectivesModule } from 'src/app/directives/directives.module';



@NgModule({
  declarations: [
    SetUsernameComponent
  ],
  imports: [
    CommonModule,
    SetUsernameRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    DirectivesModule
  ]
})
export class SetUsernameModule { }
