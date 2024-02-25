import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PreviewModalService } from './preview-modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { StatusService } from 'src/app/pages/mobile-chat/services/status.service';
import { Utils } from 'src/app/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.css']
})
export class PreviewModalComponent implements OnInit {
  @Output() statusUploadSignal: EventEmitter<any> = new EventEmitter();
  spinner = 'videoSpinner';
  public imageURL = '';
  private videoURLSubscription?: Subscription;
  constructor(
    public previewModalService: PreviewModalService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private fireStorage: AngularFireStorage,
    private statusService: StatusService,
    private ngxSpinner: NgxSpinnerService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit() {
    this.videoURLSubscription = this.previewModalService.previewURLObservable.subscribe(url => {
      this.imageURL = url as any;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.videoURLSubscription?.unsubscribe();
  }

  get poupModalVisibility$(): any {
    return this.previewModalService.modalVisibility$;
  }

  closePopup(): void {
    this.imageURL = '';
    this.previewModalService.filename = '';
    this.previewModalService.togglePopup();
  }

  get sanitizedImageURL() {
    return this.imageURL ? this.sanitizer.bypassSecurityTrustUrl(this.imageURL) : null;
  }

  async videoUpload(): Promise<void> {
    try {
      this.ngxSpinner.show(this.spinner);
      // convert blob to file
      const file = this.previewModalService.file;
      const path = `status/${this.authenticationService.auth?.user._id}/${this.previewModalService.filename}`;
      const uploadResponse = await this.fireStorage.upload(path, file as File);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        url: downloadURL,
        type: 'image'
      };
      const response = await this.statusService.createStatus(body);
      if (response.success) {
        this.statusUploadSignal.emit(response.status);
        this.previewModalService.togglePopup();
      }
    } catch (error) {
      Utils.showErrorMessage('Error uploading video', error);
    }
    this.ngxSpinner.hide(this.spinner);
  }
}
