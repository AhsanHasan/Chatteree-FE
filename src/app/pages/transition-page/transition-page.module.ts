import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransitionPageComponent } from './transition-page.component';
import { TransitionPageRoutingModule } from './transition-page-routing.module';



@NgModule({
  declarations: [
    TransitionPageComponent
  ],
  imports: [
    CommonModule,
    TransitionPageRoutingModule
  ]
})
export class TransitionPageModule { }
