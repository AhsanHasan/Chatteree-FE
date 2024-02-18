import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SearchPeopleComponent } from './search-people/search-people.component';
import { FavContactsSliderComponent } from './fav-contacts-slider/fav-contacts-slider.component';



@NgModule({
  declarations: [
    ChatComponent,
    SearchPeopleComponent,
    FavContactsSliderComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    PipesModule
  ]
})
export class ChatModule { }
