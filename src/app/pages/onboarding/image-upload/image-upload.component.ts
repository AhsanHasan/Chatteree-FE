import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { CropperModalService } from 'src/app/services/cropper-modal.service';
import { ImageCropperComponent } from 'src/app/shared/image-cropper/image-cropper.component';
import { CropperModalComponent } from 'src/app/shared/cropper-modal/cropper-modal.component';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('cropperModal') cropperModal: CropperModalComponent | undefined;
  uploadedFileName: string = '';
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

  getFile(imageFile: any): void {
    console.log(imageFile);
  }

  resetFileInput(event: Event) {
    (event.target as HTMLInputElement).value = '';
  }

}
