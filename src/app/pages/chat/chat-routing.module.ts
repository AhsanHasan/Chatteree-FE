import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { SearchPeopleService } from './services/search-people.service';


const routes: Routes = [
    {
        path: '',
        component: ChatComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        SearchPeopleService
    ]
})
export class ChatRoutingModule {
}
