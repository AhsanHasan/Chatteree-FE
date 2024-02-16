import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {
  @Input() aspectRatio: any;
  public IS_BROWSER: any = false;
  public filename = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.IS_BROWSER = isPlatformBrowser(platformId)
  }

  ngOnInit() {
  }

  fileChangeEvent(event: any, filename = ''): boolean {
    this.imageChangedEvent = event;
    this.filename = filename;
    for (const file of event.target.files) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        alert('Only images are supported.');
        return false;
      }
    }
    return event.target.files.length !== 0;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  imageLoaded() {
    //  show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  async resizeImageByWidth(blob: Blob, maxWidth: number, imgWidth: number, imgHeight: number): Promise<any> {
    return new Promise((res, rej) => {

      const img = new Image();
      img.src = URL.createObjectURL(blob);
      // let imgWidth = img.width;
      // let imgHeight = img.height;

      if (imgWidth > maxWidth) {
        imgHeight *= maxWidth / imgWidth;
        imgWidth = maxWidth;
      }

      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = imgWidth;
        elem.height = imgHeight;
        const ctx = elem.getContext('2d');
        ctx?.drawImage(img, 0, 0, imgWidth, imgHeight);
        const data = ctx?.canvas.toDataURL();
        res(data);
      };
      img.onerror = error => rej(error);
    });
  }
}
