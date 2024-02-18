import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { SearchPeopleService } from './services/search-people.service';
import { AudioRecordService } from './services/audio-record.service';
import { UserService } from './services/user.service';
import { GetAllUserResolver } from './resolvers/get-all-user.resolver';


const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: GetAllUserResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        SearchPeopleService,
        AudioRecordService,
        UserService
    ]
})
export class ChatRoutingModule {
}
