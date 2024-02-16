import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyAccountRoutingModule } from './verify-account-routing.module';
import { FormsModule } from '@angular/forms';
import { VerifyAccountComponent } from './verify-account.component';



@NgModule({
  declarations: [
    VerifyAccountComponent
  ],
  imports: [
    CommonModule,
    VerifyAccountRoutingModule,
    FormsModule
  ]
})
export class VerifyAccountModule { }
