import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { CropperModalService } from 'src/app/services/cropper-modal.service';
import { ImageCropperComponent } from 'src/app/shared/image-cropper/image-cropper.component';
import { CropperModalComponent } from 'src/app/shared/cropper-modal/cropper-modal.component';
import { Utils } from 'src/app/utils';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('cropperModal') cropperModal: CropperModalComponent | undefined;
  uploadedFileName: string = '';
  imageUrl: string = '';
  constructor(
    private cropperModalService: CropperModalService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  triggerCropper($event: any): void {
    this.cropperModal?.triggerCropper($event);
    this.cropperModalService.togglePopup();
  }

  async getFile(imageFile: any): Promise<void> {
    this.imageUrl = this.getObjectURL(imageFile.file);
  }

  getObjectURL(file: File): string {
    if (file) {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating object URL:', error);
      }
    }

    return '';
  }

  resetFileInput(event: Event) {
    (event.target as HTMLInputElement).value = '';
  }

}
