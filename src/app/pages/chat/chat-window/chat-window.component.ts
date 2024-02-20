import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AudioRecordService } from '../services/audio-record.service';
import { SearchPeopleService } from '../services/search-people.service';
import { Chatroom } from '../interfaces/chatroom.interface';
import { Message } from '../interfaces/message.interface';
import { MessageService } from '../services/message.service';
import { Utils } from 'src/app/utils';
import { NgxPusherService } from 'ngx-pusher';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AttachmentService } from '../services/attachment.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnChanges {
  @Input() selectedParticipant: any;
  @Input() selectedChatroomId: any;
  @Output() messageReceivedSignal = new EventEmitter<any>();
  message = '';
  showAudioPopup = false;
  audioBlob: any;
  showEmojiPopup = false;
  showAttachmentPopup = false;
  chatRooms: Chatroom[] = [];
  messages: Message[] = [];

  uploadMediaType = '';
  uploadedBlob: any;
  uploadMediaFile: File | null = null;
  uploadDocumentName = '';
  isAttachmentSelected = false;
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    public audioService: AudioRecordService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage,
    private attachmentService: AttachmentService
  ) {
    this.route.data.subscribe((data: any) => {
      this.chatRooms = data.chatrooms.data.chatRooms;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedChatroomId'] && changes['selectedChatroomId'].currentValue !== changes['selectedChatroomId'].previousValue) {
      if (this.selectedChatroomId) {
        this.getChatroomMessages(null);
      }
    }
  }

  toggleAttachmentPopup(): void {
    this.showAttachmentPopup = !this.showAttachmentPopup;
    this.removeAttachment();
  }

  openSearchPeopleModal(): void {
    this.searchPeopleService.togglePopup();
  }

  addEmoji($event: any): void {
    this.message += $event.emoji.native;
  }

  onFileSelected(event: any, type: string): void {
    const file = event.target.files[0];
    this.uploadMediaFile = file;
    this.uploadMediaType = type;
    this.isAttachmentSelected = true;
    // convert file to blob
    switch (type) {
      case 'image':
      case 'audio':
        const fileBlob = URL.createObjectURL(file);
        this.uploadedBlob = fileBlob;
        break;
      case 'file':
        this.uploadDocumentName = file.name;
        break;
      default:
        break;
    }
    this.attachmentService.attachmentData = {
      uploadMediaType: this.uploadMediaType,
      uploadedBlob: this.uploadedBlob,
      uploadMediaFile: this.uploadMediaFile,
      uploadDocumentName: this.uploadDocumentName,
      isAttachmentSelected: this.isAttachmentSelected,
      selectedChatroomId: this.selectedChatroomId as string
    };

    this.attachmentService.togglePopup();
  }

  removeAttachment(): void {
    this.uploadedBlob = null;
    this.uploadMediaType = '';
    this.uploadMediaFile = null;
    this.uploadDocumentName = '';
  }

  async recordAudio(): Promise<void> {
    if (!this.audioService.isRecording) {
      this.showAudioPopup = true;
      this.audioService.startRecording();
    }
  }

  async stopRecordingAudio(): Promise<void> {
    if (this.audioService.isRecording) {
      const audioBlob = await this.audioService.stopRecording();
      this.audioBlob = this.getRecordingUrl(audioBlob);
    }
  }

  getRecordingUrl(audioBlob: any): string {
    return URL.createObjectURL(audioBlob);
  }

  removeAudio(): void {
    this.audioBlob = null;
    this.showAudioPopup = false;
  }

  uploadAudio(): void {
    console.log('Uploading audio...');
  }

  async getChatroomMessages(page: number | null): Promise<void> {
    try {
      if (!this.selectedChatroomId) {
        return;
      }
      const query = {
        page: page ? page : 1,
        limit: 10,
        chatroomId: this.selectedChatroomId
      };
      const response = await this.messageService.getChatroomMessages(query);
      if (response.success) {
        this.messages = response.data;
        if (this.messages.length === 1 && this.messages[0].content === '') {
          this.messages = [];
        }
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to get chat room messages', error);
    }
  }

  async sendMessage(): Promise<void> {
    try {
      const body = {
        chatroomId: this.selectedChatroomId,
        content: this.message,
        type: 'text'
      };
      const response = await this.messageService.sendMessage(body);
      if (response.success) {
        this.message = '';
        this.getChatroomMessages(null);
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to send message', error);
    }
  }

  getAttachedFileName(attachment: string): string {
    return Utils.extractFilenameFromFirebasePath(attachment);
  }

  async sendImageMessage(): Promise<void> {
    try {
      const path = `chatroom/${this.selectedChatroomId}/images/${this.uploadMediaFile?.name}`;
      const uploadResponse = await this.fireStorage.upload(path, this.uploadMediaFile as File);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        chatroomId: this.selectedChatroomId,
        content: downloadURL,
        type: 'image'
      };
      const response = await this.messageService.sendMessage(body);
      if (response.success) {
        this.removeAttachment();
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to send image message', error);
    }
  }

  async sendFileMessage(): Promise<void> {
    try {
      const path = `chatroom/${this.selectedChatroomId}/files/${this.uploadMediaFile?.name}?searchable=${this.uploadDocumentName}`;
      const uploadResponse = await this.fireStorage.upload(path, this.uploadMediaFile as File);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        chatroomId: this.selectedChatroomId,
        content: downloadURL,
        type: 'file'
      };
      const response = await this.messageService.sendMessage(body);
      if (response.success) {
        this.removeAttachment();
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to send file message', error);
    }
  }

  async sendAudioMessage(): Promise<void> {
    try {
      throw new Error('Not implemented');
    } catch (error) {
      Utils.showErrorMessage('Failed to send audio message', error);
    }
  }

}
