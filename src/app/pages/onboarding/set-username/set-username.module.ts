import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetUsernameComponent } from './set-username.component';
import { SetUsernameRoutingModule } from './set-username-routing.module';



@NgModule({
  declarations: [
    SetUsernameComponent
  ],
  imports: [
    CommonModule,
    SetUsernameRoutingModule
  ]
})
export class SetUsernameModule { }
