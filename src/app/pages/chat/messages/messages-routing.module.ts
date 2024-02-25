import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { AudioRecordService } from '../services/audio-record.service';
import { MessageService } from '../services/message.service';
import { AttachmentService } from '../services/attachment.service';
import { GetAllMessageResolver } from '../resolvers/get-chatroom-messages.resolver';
import { ChatroomService } from '../services/chatroom.service';


const routes: Routes = [
    {
        path: '',
        component: MessagesComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
            messages: GetAllMessageResolver,
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        AudioRecordService,
        MessageService,
        AttachmentService,
        ChatroomService
    ]
})
export class MessagesRoutingModule {
}
