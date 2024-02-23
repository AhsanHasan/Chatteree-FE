import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MessagesComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    PipesModule,
    DirectivesModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    PickerComponent,
    FormsModule,
    SharedModule
  ],
  exports: [
  ]
})
export class MessagesModule { }
