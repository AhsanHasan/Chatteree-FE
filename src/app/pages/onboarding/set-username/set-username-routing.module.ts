import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetUsernameComponent } from './set-username.component';


const routes: Routes = [
    {
        path: '',
        component: SetUsernameComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SetUsernameRoutingModule {
}
