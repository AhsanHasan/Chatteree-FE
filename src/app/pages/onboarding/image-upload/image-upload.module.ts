import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import { ImageUploadRoutingModule } from './image-upload-routing.module';



@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    ImageUploadRoutingModule
  ]
})
export class ImageUploadModule { }
