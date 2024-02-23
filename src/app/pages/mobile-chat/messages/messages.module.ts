import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MessageRoutingModule } from './messages-routing.module';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AttachmentService } from '../../chat/services/attachment.service';
import { AudioRecordService } from '../../chat/services/audio-record.service';
import { MessageService } from '../../chat/services/message.service';
import { FavoriteChatroomService } from '../../chat/services/favorite-chatroom.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    PipesModule,
    DirectivesModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    PickerComponent,
    FormsModule,
    SharedModule
  ],
  providers: [
    AttachmentService,
    AudioRecordService,
    MessageService,
    FavoriteChatroomService
  ]
})
export class MessagesModule { }
