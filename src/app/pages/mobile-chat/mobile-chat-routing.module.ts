import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileChatComponent } from './mobile-chat.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'chats',
        pathMatch: 'full'
    },
    {
        path: 'chats',
        loadChildren: () => import('./chats/chats.module').then(m => m.ChatsModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class MobileChatRoutingModule {
}
