import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import { ImageUploadRoutingModule } from './image-upload-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';



@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    ImageUploadRoutingModule,
    SharedModule,
    FormsModule,
    DirectivesModule
  ]
})
export class ImageUploadModule { }
