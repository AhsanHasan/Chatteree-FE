import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageUploadComponent } from './image-upload.component';
import { GeneralInformationService } from './services/general-information.service';


const routes: Routes = [
    {
        path: '',
        component: ImageUploadComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [GeneralInformationService]
})
export class ImageUploadRoutingModule {
}
