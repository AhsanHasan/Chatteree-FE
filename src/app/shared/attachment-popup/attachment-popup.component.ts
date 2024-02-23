import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Utils } from 'src/app/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { AttachmentService } from 'src/app/pages/chat/services/attachment.service';
import { MessageService } from 'src/app/pages/chat/services/message.service';

@Component({
  selector: 'app-attachment-popup',
  templateUrl: './attachment-popup.component.html',
  styleUrls: ['./attachment-popup.component.css']
})
export class AttachmentPopupComponent {
  spinner = 'attachment-popup-spinner'
  constructor(
    public attachmentService: AttachmentService,
    private fireStorage: AngularFireStorage,
    private messageService: MessageService,
    private ngxSpinner: NgxSpinnerService
    ) {  }

  get poupModalVisibility$(): any {
    return this.attachmentService.modalVisibility$;
  }

  closePopup(): void {
    this.attachmentService.togglePopup();
  }

  async sendAttachment(): Promise<void> {
    try {
      this.ngxSpinner.show(this.spinner);
      const path = `chatroom/${this.attachmentService.attachmentData.selectedChatroomId}/${this.attachmentService.attachmentData.uploadMediaType}/${this.attachmentService.attachmentData.uploadMediaFile.name}`;
      const uploadResponse = await this.fireStorage.upload(path, this.attachmentService.attachmentData.uploadMediaFile as File);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        chatroomId: this.attachmentService.attachmentData.selectedChatroomId,
        content: downloadURL,
        type: this.attachmentService.attachmentData.uploadMediaType
      };
      const response = await this.messageService.sendMessage(body);
      if (response.success) {
        this.attachmentService.togglePopup();
      }
    } catch (error) {
      Utils.showErrorMessage('Error sending attachment', error);
    }
    this.ngxSpinner.hide(this.spinner);
  }
}
