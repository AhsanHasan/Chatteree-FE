import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetUsernameComponent } from './set-username.component';
import { SetUsernameService } from './services/set-username.service';


const routes: Routes = [
    {
        path: '',
        component: SetUsernameComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        SetUsernameService
    ]
})
export class SetUsernameRoutingModule {
}
