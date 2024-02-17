import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncodeProfilePictureUrlPipe } from './encode-profile-picture.pipe';



@NgModule({
  declarations: [
    EncodeProfilePictureUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EncodeProfilePictureUrlPipe
  ]
})
export class PipesModule { }
