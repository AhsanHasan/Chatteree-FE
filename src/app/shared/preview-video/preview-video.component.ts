import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VideoPreviewModalService } from './preview-video.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { StatusService } from 'src/app/pages/mobile-chat/services/status.service';
import { Utils } from 'src/app/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-preview-video',
  templateUrl: './preview-video.component.html',
  styleUrls: ['./preview-video.component.css']
})
export class PreviewVideoComponent implements OnInit {
  spinner = 'videoSpinner';
  public videoURL = '';
  private videoURLSubscription?: Subscription;
  constructor(
    public videoPreviewModalService: VideoPreviewModalService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private fireStorage: AngularFireStorage,
    private statusService: StatusService,
    private ngxSpinner: NgxSpinnerService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() {
    this.videoURLSubscription = this.videoPreviewModalService.videoURLObservable.subscribe(url => {
      this.videoURL = url as any;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.videoURLSubscription?.unsubscribe();
  }

  get poupModalVisibility$(): any {
    return this.videoPreviewModalService.modalVisibility$;
  }

  closePopup(): void {
    this.videoURL = '';
    this.videoPreviewModalService.filename = '';
    this.videoPreviewModalService.togglePopup();
  }

  get sanitizedVideoURL() {
    return this.videoURL ? this.sanitizer.bypassSecurityTrustUrl(this.videoURL) : null;
  }

  async videoUpload(): Promise<void> {
    try {
      this.ngxSpinner.show(this.spinner);
      // convert blob to file
      const file = this.videoPreviewModalService.file;
      const path = `status/${this.authenticationService.auth?.user._id}/${this.videoPreviewModalService.filename}`;
      const uploadResponse = await this.fireStorage.upload(path, file as File);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        url: downloadURL,
        type: 'video'
      };
      const response = await this.statusService.createStatus(body);
      if (response.success) {
        this.videoPreviewModalService.togglePopup();
      }
    } catch (error) {
      Utils.showErrorMessage('Error uploading video', error);
    }
    this.ngxSpinner.hide(this.spinner);
  }
}
