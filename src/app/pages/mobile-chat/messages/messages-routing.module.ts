import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { GetAllMessageResolver } from '../../chat/resolvers/get-chatroom-messages.resolver';


const routes: Routes = [
    {
        path: '',
        component: MessagesComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
            messages: GetAllMessageResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class MessageRoutingModule {
}
