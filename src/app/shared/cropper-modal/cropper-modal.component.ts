import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CropperModalService } from 'src/app/services/cropper-modal.service';
import { Utils } from 'src/app/utils';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-cropper-modal',
  templateUrl: './cropper-modal.component.html',
  styleUrls: ['./cropper-modal.component.css']
})
export class CropperModalComponent {
  @ViewChild(ImageCropperComponent) imageCropper?: ImageCropperComponent;
  @Input() uploadedFileName: string = '';
  @Output() fileEmitter: EventEmitter<ConfirmationResponse> = new EventEmitter<ConfirmationResponse>();
  file!: File;

  constructor(
    private cropperModalService: CropperModalService
  ) { }

  get poupModalVisibility$(): any {
    return this.cropperModalService.modalVisibility$;
  }

  closePopup(): void {
    this.cropperModalService.togglePopup();
  }

  async saveCroppedImage(): Promise<void> {
    if (this.uploadedFileName === '') {
      // Create random file name if not provided
      this.uploadedFileName = `image-${new Date().getTime()}.png`;
    }
    this.file = await Utils.convertBlobImageToFile(this.imageCropper?.croppedImage, this.uploadedFileName) as any;
    this.fileEmitter.emit({ file: this.file, uploadedFileName: this.uploadedFileName });
    this.closePopup();
  }

  triggerCropper($event: any): void {
    if (this.imageCropper?.fileChangeEvent($event)) {
      this.imageCropper.fileChangeEvent($event);
      this.uploadedFileName = $event.target.files[0].name;
      $event.target.files = null;
    }
  }
}

export interface ConfirmationResponse {
  file: File;
  uploadedFileName: string;
}