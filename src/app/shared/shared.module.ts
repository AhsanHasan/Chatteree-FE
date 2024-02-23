import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PopupModalComponent } from './popup-modal/popup-modal.component';
import { CropperModalComponent } from './cropper-modal/cropper-modal.component';
import { AttachmentService } from '../pages/chat/services/attachment.service';
import { MessageService } from '../pages/chat/services/message.service';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AttachmentPopupComponent } from './attachment-popup/attachment-popup.component';


@NgModule({
  declarations: [
    ImageCropperComponent,
    PopupModalComponent,
    CropperModalComponent,
    AttachmentPopupComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    PipesModule,
    DirectivesModule,
    NgxSpinnerModule
  ],
  exports: [
    ImageCropperComponent,
    PopupModalComponent,
    CropperModalComponent,
    AttachmentPopupComponent
  ],
  providers: [
    AttachmentService,
    MessageService
  ]
})
export class SharedModule { }
