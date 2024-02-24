import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncodeProfilePictureUrlPipe } from './encode-profile-picture.pipe';
import { TruncatePipe } from './truncate.pipe';
import { GroupByPipe } from './groupby.pipe';
import { SafePipe } from './safe.pipe';



@NgModule({
  declarations: [
    EncodeProfilePictureUrlPipe,
    TruncatePipe,
    GroupByPipe,
    SafePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EncodeProfilePictureUrlPipe,
    TruncatePipe,
    GroupByPipe,
    SafePipe
  ]
})
export class PipesModule { }
