import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './chats.component';
import { ChatRoutingModule } from './chats-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AttachmentService } from '../../chat/services/attachment.service';
import { AudioRecordService } from '../../chat/services/audio-record.service';
import { ChatroomService } from '../../chat/services/chatroom.service';
import { FavoriteChatroomService } from '../../chat/services/favorite-chatroom.service';
import { MessageService } from '../../chat/services/message.service';
import { SearchPeopleService } from '../../chat/services/search-people.service';
import { UserService } from '../../chat/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ChatsComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SlickCarouselModule,
    PipesModule,
    DirectivesModule,
    SharedModule
  ],
  providers: [
    SearchPeopleService,
    AudioRecordService,
    UserService,
    ChatroomService,
    MessageService,
    AttachmentService,
    FavoriteChatroomService
  ]
})
export class ChatsModule { }
