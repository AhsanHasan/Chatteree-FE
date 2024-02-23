import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileChatComponent } from './mobile-chat.component';
import { MobileChatRoutingModule } from './mobile-chat-routing.module';



@NgModule({
  declarations: [
    MobileChatComponent
  ],
  imports: [
    CommonModule,
    MobileChatRoutingModule
  ]
})
export class MobileChatModule { }
