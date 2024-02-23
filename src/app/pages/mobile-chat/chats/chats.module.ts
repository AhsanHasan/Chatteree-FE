import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './chats.component';
import { ChatRoutingModule } from './chats-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';



@NgModule({
  declarations: [
    ChatsComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SlickCarouselModule
  ]
})
export class ChatsModule { }
