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
import { UserPopupComponent } from './user-popup/user-popup.component';
import { SearchPeopleService } from '../pages/chat/services/search-people.service';
import { UserService } from '../pages/chat/services/user.service';
import { ChatroomService } from '../pages/chat/services/chatroom.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    ImageCropperComponent,
    PopupModalComponent,
    CropperModalComponent,
    AttachmentPopupComponent,
    UserPopupComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    PipesModule,
    DirectivesModule,
    NgxSpinnerModule,
    InfiniteScrollModule
  ],
  exports: [
    ImageCropperComponent,
    PopupModalComponent,
    CropperModalComponent,
    AttachmentPopupComponent,
    UserPopupComponent
  ],
  providers: [
    AttachmentService,
    MessageService,
    SearchPeopleService,
    UserService,
    ChatroomService
  ]
})
export class SharedModule { }
