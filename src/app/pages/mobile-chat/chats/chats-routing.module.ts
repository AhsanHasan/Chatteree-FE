import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatsComponent } from './chats.component';
import { GetAllChatroomResolver } from '../../chat/resolvers/get-all-chatroom.resolver';
import { GetAllUserResolver } from '../../chat/resolvers/get-all-user.resolver';
import { GetAllStatusResolver } from '../resolvers/get-status.resolver';


const routes: Routes = [
    {
        path: '',
        component: ChatsComponent,
        resolve: {
            users: GetAllUserResolver,
            chatrooms: GetAllChatroomResolver,
            status: GetAllStatusResolver
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
