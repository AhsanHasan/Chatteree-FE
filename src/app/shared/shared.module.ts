import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PopupModalComponent } from './popup-modal/popup-modal.component';
import { CropperModalComponent } from './cropper-modal/cropper-modal.component';


@NgModule({
  declarations: [
    ImageCropperComponent,
    PopupModalComponent,
    CropperModalComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule
  ],
  exports: [
    ImageCropperComponent,
    PopupModalComponent,
    CropperModalComponent
  ]
})
export class SharedModule { }
