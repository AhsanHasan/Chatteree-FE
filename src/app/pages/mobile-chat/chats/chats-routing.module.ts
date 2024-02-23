import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsComponent } from './chats.component';
import { GetAllChatroomResolver } from '../../chat/resolvers/get-all-chatroom.resolver';
import { GetAllUserResolver } from '../../chat/resolvers/get-all-user.resolver';


const routes: Routes = [
    {
        path: '',
        component: ChatsComponent,
        resolve: {
            users: GetAllUserResolver,
            chatrooms: GetAllChatroomResolver,
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class ChatRoutingModule {
}
