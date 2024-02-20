import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncodeProfilePictureUrlPipe } from './encode-profile-picture.pipe';
import { TruncatePipe } from './truncate.pipe';



@NgModule({
  declarations: [
    EncodeProfilePictureUrlPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EncodeProfilePictureUrlPipe,
    TruncatePipe
  ]
})
export class PipesModule { }
