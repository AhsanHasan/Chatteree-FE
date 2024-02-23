import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncodeProfilePictureUrlPipe } from './encode-profile-picture.pipe';
import { TruncatePipe } from './truncate.pipe';
import { GroupByPipe } from './groupby.pipe';



@NgModule({
  declarations: [
    EncodeProfilePictureUrlPipe,
    TruncatePipe,
    GroupByPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EncodeProfilePictureUrlPipe,
    TruncatePipe,
    GroupByPipe
  ]
})
export class PipesModule { }
