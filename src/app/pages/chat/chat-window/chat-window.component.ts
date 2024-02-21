import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AudioRecordService } from '../services/audio-record.service';
import { SearchPeopleService } from '../services/search-people.service';
import { Chatroom } from '../interfaces/chatroom.interface';
import { Message } from '../interfaces/message.interface';
import { MessageService } from '../services/message.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AttachmentService } from '../services/attachment.service';
import { Utils } from 'src/app/utils';
import { FavoriteChatroomService } from '../services/favorite-chatroom.service';
import { FavoriteChatroom } from '../interfaces/favorite-chatroom.interface';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() selectedParticipant: any;
  @Input() selectedChatroomId: any;
  @Input() selectedChatroom: any;
  @Output() messageReceivedSignal = new EventEmitter<any>();
  @Output() chatroomFavoriteSignal = new EventEmitter<any>();
  @Output() backButtonSignal = new EventEmitter<any>();
  message = '';
  showAudioPopup = false;
  showPlayerPopup = false;
  audioBlob: any;
  showEmojiPopup = false;
  showAttachmentPopup = false;
  chatRooms: Chatroom[] = [];
  messages: Message[] = [];
  pagination: any;

  uploadMediaType = '';
  uploadedBlob: any;
  uploadMediaFile: File | null = null;
  uploadDocumentName = '';
  isAttachmentSelected = false;

  isRecording = false;
  audioURL: string | null = null;

  isFavoriteChatroom = false;

  public IS_BROWSER: any = false;
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    public audioService: AudioRecordService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage,
    private attachmentService: AttachmentService,
    private cd: ChangeDetectorRef,
    private favoriteChatroomService: FavoriteChatroomService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.IS_BROWSER = isPlatformBrowser(platformId);
    this.route.data.subscribe((data: any) => {
      this.chatRooms = data.chatrooms.data.chatRooms;
    });
  }

  ngOnInit(): void {
    if (this.IS_BROWSER) {
      this.audioService.audioBlob$.subscribe((audioBlob: any) => {
        this.audioURL = window.URL.createObjectURL(audioBlob);
        this.audioBlob = audioBlob;
        this.cd.detectChanges();
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.IS_BROWSER) {
      console.log('scrolling to bottom: ', document.body.scrollHeight);
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['selectedChatroomId'] && changes['selectedChatroomId'].currentValue !== changes['selectedChatroomId'].previousValue) {
      if (this.selectedChatroomId) {
        await this.getChatroomMessages(null);
        console.log(this.messages);
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
    this.showAudioPopup = true
    this.isRecording = true;
    this.audioService.startRecording();
  }

  async stopRecordingAudio(): Promise<void> {
    this.isRecording = false;
    this.audioService.stopRecording();
    this.showPlayerPopup = true;
  }

  getRecordingUrl(audioBlob: any): string {
    return URL.createObjectURL(audioBlob);
  }

  removeAudio(): void {
    this.audioBlob = null;
    this.showAudioPopup = false;
    this.showPlayerPopup = false;
  }

  async getChatroomMessages(page: number | null): Promise<void> {
    try {
      if (!this.selectedChatroomId) {
        return;
      }
      const query = {
        page: page ? page : 1,
        limit: 200,
        chatroomId: this.selectedChatroomId
      };
      const response = await this.messageService.getChatroomMessages(query);
      if (response.success) {
        this.messages = response.data.messages;
        this.pagination = response.data.pagination;
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
      if (!this.message || this.message.trim() === ''){
        return;
      }
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

  async sendAudioMessage(): Promise<void> {
    try {
      // Create file from object URL
      const filename = `${Date.now()}.mp3`;
      const path = `chatroom/${this.selectedChatroomId}/voice-note/${filename}`;
      const uploadResponse = await this.fireStorage.upload(path, this.audioBlob as Blob);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      const body = {
        chatroomId: this.selectedChatroomId,
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

  async toggleFavoriteChatroom(chatroomId: string): Promise<void> {
    try {
      this.selectedChatroom.isFavorite = !this.selectedChatroom.isFavorite;
      const body: FavoriteChatroom = {
        chatRoomId: chatroomId,
        userId: this.authenticationService.auth?.user._id as string
      };
      const response = await this.favoriteChatroomService.toggleFavoriteChatroom(body);
      if (response.success) {
        this.isFavoriteChatroom = !this.isFavoriteChatroom;
        // Remove chatroom from favorite chatrooms list
        this.chatroomFavoriteSignal.emit(chatroomId);
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to toggle favorite chatroom', error);
    }
  }

  goBack(): void {
    this.backButtonSignal.emit(true);
  }

  async onScroll(): Promise<void> {
    this.pagination.page = 2;
    // await this.getChatroomMessages(this.pagination.page);
  }

  async onScrolledUp(): Promise<void> {
    this.pagination.page += 1;
    // await this.getChatroomMessages(this.pagination.page);
  }
}
