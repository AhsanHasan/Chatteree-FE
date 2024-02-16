import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyAccountComponent } from './verify-account.component';
import { VerifyAccountService } from './services/verify-account.service';


const routes: Routes = [
    {
        path: '',
        component: VerifyAccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        VerifyAccountService
    ]
})
export class VerifyAccountRoutingModule {
}
