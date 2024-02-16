import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetUsernameComponent } from './set-username.component';
import { SetUsernameRoutingModule } from './set-username-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SetUsernameComponent
  ],
  imports: [
    CommonModule,
    SetUsernameRoutingModule,
    FormsModule
  ]
})
export class SetUsernameModule { }
