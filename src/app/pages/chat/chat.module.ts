import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { FavContactsSliderComponent } from './fav-contacts-slider/fav-contacts-slider.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { SearchableChatRoomComponent } from './searchable-chat-room/searchable-chat-room.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ChatComponent,
    FavContactsSliderComponent,
    ChatRoomComponent,
    ChatWindowComponent,
    SearchableChatRoomComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    PipesModule,
    PickerComponent,
    FormsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    SharedModule
  ],
  exports: []
})
export class ChatModule { }
