import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { SearchPeopleService } from './services/search-people.service';
import { AudioRecordService } from './services/audio-record.service';
import { UserService } from './services/user.service';
import { GetAllUserResolver } from './resolvers/get-all-user.resolver';
import { GetAllChatroomResolver } from './resolvers/get-all-chatroom.resolver';
import { ChatroomService } from './services/chatroom.service';
import { MessageService } from './services/message.service';
import { AttachmentService } from './services/attachment.service';
import { FavoriteChatroomService } from './services/favorite-chatroom.service';
import { GetAllFavoriteChatroomResolver } from './resolvers/get-all-favorite-chatroom.resolver';


const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: GetAllUserResolver,
            chatrooms: GetAllChatroomResolver,
            favorites: GetAllFavoriteChatroomResolver
        },
        children: [
            {
                path: ':id',
                loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
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
export class ChatRoutingModule {
}
