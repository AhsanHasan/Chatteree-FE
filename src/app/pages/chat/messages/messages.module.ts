import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AttachmentPopupComponent } from '../attachment-popup/attachment-popup.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MessagesComponent,
    AttachmentPopupComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    PipesModule,
    DirectivesModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    PickerComponent,
    FormsModule
  ]
})
export class MessagesModule { }
