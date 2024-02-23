import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chatroom } from '../interfaces/chatroom.interface';
import { Message } from '../interfaces/message.interface';
import { Pagination } from 'src/app/interfaces/pagination.interface';
import { Utils } from 'src/app/utils';
import { FavoriteChatroom } from '../interfaces/favorite-chatroom.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FavoriteChatroomService } from '../services/favorite-chatroom.service';
import { MessageService } from '../services/message.service';
import { AttachmentService } from '../services/attachment.service';
import { AudioRecordService } from '../services/audio-record.service';
import { isPlatformBrowser } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { PusherService } from 'src/app/services/pusher.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements AfterViewInit, OnChanges, AfterViewChecked {
  @ViewChild('messageSection') messageSection: ElementRef | undefined;
  spinner = 'messageSpinner';
  chatroomInformation!: Chatroom;
  messages: any[] = [];
  cachedMessages: Message[] = [];

  infiniteScrollDisabled = false;

  pagination: Pagination = {
    currentPage: 0,
    totalPages: 0,
    totalDocuments: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }

  showEmojiPopup = false;
  showAttachmentPopup = false;
  isAttachmentSelected = false;

  uploadedBlob: any = null;
  uploadMediaType = '';
  uploadMediaFile: File | null = null;
  uploadDocumentName = '';

  message = '';

  audioURL: string | null = null;
  audioBlob: any;
  showAudioPopup = false;
  isRecording = false;
  showPlayerPopup = false;

  shouldScrollToBottom = true;

  IS_BROWSER = false

  currentScrollPosition: number | null = null;
  currentScrollHeight: number | null = null;
  constructor(
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private favoriteChatroomService: FavoriteChatroomService,
    private messageService: MessageService,
    private attachmentService: AttachmentService,
    public audioService: AudioRecordService,
    private fireStorage: AngularFireStorage,
    private pusherService: PusherService,
    private ngxSpinnerService: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.IS_BROWSER = isPlatformBrowser(platformId);
    this.pusherService.messageSubject.subscribe(async (data: any) => {
      await this.getMessages(1);
    });
    this.route.data.subscribe((data: any) => {
      this.chatroomInformation = data.messages.data.chatRoom;
      this.messages = data.messages.data.messages;
      this.pagination = data.messages.data.pagination;
    });
    // Listen for changes to URL params
    this.route.params.subscribe(async (params: any) => {
      if (params.id !== this.chatroomInformation._id) {
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.IS_BROWSER) {
      this.scrollToBottom();
      this.audioService.audioBlob$.subscribe((audioBlob: any) => {
        this.audioURL = window.URL.createObjectURL(audioBlob);
        this.audioBlob = audioBlob;
        this.cd.detectChanges();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
  }

  async toggleFavoriteChatroom(chatroomId: string): Promise<void> {
    try {
      this.chatroomInformation.isFavorite = !this.chatroomInformation.isFavorite;
      const body: FavoriteChatroom = {
        chatRoomId: chatroomId,
        userId: this.authenticationService.auth?.user._id as string
      };
      const response = await this.favoriteChatroomService.toggleFavoriteChatroom(body);
      if (response.success) {
        this.favoriteChatroomService.favorite$.next(response.data);
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to toggle favorite chatroom', error);
    }
  }

  async sendMessage(): Promise<void> {
    try {
      if (!this.message || this.message.trim() === '') return;
      const body = {
        chatroomId: this.chatroomInformation._id,
        content: this.message,
        type: 'text'
      };
      const response = await this.messageService.sendMessage(body);
      if (response.success) {
        this.message = '';
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to send message', error);
    }
  }

  addEmoji($event: any): void {
    this.message += $event.emoji.native;
  }

  toggleAttachmentPopup(): void {
    this.showAttachmentPopup = !this.showAttachmentPopup;
    this.removeAttachment();
  }

  removeAttachment(): void {
    this.uploadedBlob = null;
    this.uploadMediaType = '';
    this.uploadMediaFile = null;
    this.uploadDocumentName = '';
  }

  onScrolledUp(): void {
    this.pagination.currentPage += 1;
    const query = {
      page: this.pagination.currentPage,
      limit: 5,
      chatroomId: this.chatroomInformation._id
    };
    const lastMessageId = this.messages[0].messages[0]._id;
    this.ngxSpinnerService.show(this.spinner);
    if (this.cachedMessages && this.cachedMessages[this.pagination.currentPage]) {
      this.messages = this.organizeMessagesByDate(this.cachedMessages[this.pagination.currentPage] as any, this.messages);
      setTimeout(() => {
        const element = document.getElementById(lastMessageId);
        if (element) {
          this.messageSection!.nativeElement.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
          });
        }
      }, 0);
      this.ngxSpinnerService.hide(this.spinner);
      return;
    }
    this.infiniteScrollDisabled = true;
    // this.updateScrollPosition(currentScrollPosition, currentScrollHeight);
    if (!this.pagination.hasNextPage) {
      this.ngxSpinnerService.hide(this.spinner);
      return;
    }
    this.messageService.getChatroomMessages(query).then((response: any) => {
      const newMessages = response.data.messages;
      this.messages = this.organizeMessagesByDate(newMessages, this.messages);
      setTimeout(() => {
        const element = document.getElementById(lastMessageId);
        if (element) {
          this.messageSection!.nativeElement.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
          });
        }
      }, 0);
      this.pagination = response.data.pagination;
      this.infiniteScrollDisabled = false;
      this.ngxSpinnerService.hide(this.spinner);
    });
    this.prefetchNextPage();
  }

  prefetchNextPage(): void {
    if (this.cachedMessages[this.pagination.currentPage + 1]) return;
    this.pagination.currentPage += 1;
    const query = {
      page: this.pagination.currentPage,
      limit: 5,
      chatroomId: this.chatroomInformation._id
    };
    this.messageService.getChatroomMessages(query).then((response: any) => {
      this.cachedMessages[this.pagination.currentPage + 1] = response.data.messages;
      this.pagination = response.data.pagination;
    });
  }

  organizeMessagesByDate(newMessages: any[], existingMessages: any[]): any[] {
    const idMap = new Map();
    function addToMap(arr: any[]) {
      arr.forEach(({ _id, messages }) => {
        if (!idMap.has(_id)) {
          idMap.set(_id, []);
        }
        idMap.get(_id).push(...messages);
      });
    }
    addToMap(newMessages);
    addToMap(existingMessages);
    const result = Array.from(idMap, ([_id, messages]) => ({ _id, messages }));
    this.shouldScrollToBottom = true;
    return result;
  }

  getAttachedFileName(attachment: string): string {
    return Utils.extractFilenameFromFirebasePath(attachment);
  }

  goBack(): void {
    console.log('Go back');
  }

  onFileSelected(event: any, type: string): void {
    const file = event.target.files[0];
    this.uploadMediaFile = file;
    this.uploadMediaType = type;
    this.isAttachmentSelected = true;
    this.showAttachmentPopup = false;
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
      selectedChatroomId: this.chatroomInformation._id as string
    };

    this.attachmentService.togglePopup();
  }

  async recordAudio(): Promise<void> {
    this.showAudioPopup = true
    this.isRecording = true;
    await this.audioService.startRecording();
  }

  async stopRecordingAudio(): Promise<void> {
    this.isRecording = false;
    await this.audioService.stopRecording();
    this.showAudioPopup = false;
    this.showPlayerPopup = true;
  }

  removeAudio(): void {
    this.audioBlob = null;
    this.showAudioPopup = false;
    this.showPlayerPopup = false;
  }

  async sendAudioMessage(): Promise<void> {
    try {
      // Create file from object URL
      const filename = `${Date.now()}.mp3`;
      const path = `chatroom/${this.chatroomInformation._id}/voice-note/${filename}`;
      const uploadResponse = await this.fireStorage.upload(path, this.audioBlob as Blob);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        chatroomId: this.chatroomInformation._id,
        content: downloadURL,
        type: 'voice-note'
      };
      const response = await this.messageService.sendMessage(body);
      if (response.success) {
        this.removeAudio();
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to send audio message', error);
    }
  }

  async getMessages(page: number): Promise<void> {
    try {
      const query = {
        page: page ? page : 1,
        limit: 10,
        chatroomId: this.chatroomInformation._id
      };
      const response = await this.messageService.getChatroomMessages(query);
      if (response.success) {
        this.messages = response.data.messages;
        this.pagination = response.data.pagination;
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to get messages', error);
    }
  }

  scrollToBottom(): void {
    if (this.IS_BROWSER) {
      if (this.messageSection) {
        // Scroll to bottom of message section
        setTimeout(() => {
          this.messageSection!.nativeElement.scrollTo({
            top: this.messageSection!.nativeElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  isFirstMessageOfDay(messageGroupIndex: number, meessageGroup: any[]): boolean {
    return messageGroupIndex === 0;
  }
}
