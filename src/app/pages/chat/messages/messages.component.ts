import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import Swal from 'sweetalert2';
import { UserDetailsModalService } from 'src/app/shared/user-details/user-details.service';
import { UserDetailsComponent } from 'src/app/shared/user-details/user-details.component';
import { ChatroomService } from '../services/chatroom.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements AfterViewInit, OnChanges, AfterViewChecked {
  @ViewChild('messageSection') messageSection: ElementRef | undefined;
  @ViewChild('userInformation') userInformation: UserDetailsComponent | undefined;
  spinner = 'messageSpinner';
  chatroomInformation!: Chatroom;
  messages: any[] = [];
  cachedMessages: Message[] = [];

  infiniteScrollDisabled = true;

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

  lastMessageId: string | null = null;

  showScrollToTop = false;

  showMenu = false;

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
    private router: Router,
    private userDetailsService: UserDetailsModalService,
    private chatroomService: ChatroomService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.IS_BROWSER = isPlatformBrowser(platformId);
    this.pusherService.messageSubject.subscribe(async (data: any) => {
      await this.getMessages(1);
    });
    this.pusherService.onlineStatusSubject.subscribe((data) => {
      if (this.chatroomInformation.participants._id === data._id) {
        this.chatroomInformation.participants.onlineStatus = data.onlineStatus;
      }
    })
    this.route.data.subscribe((data: any) => {
      this.chatroomInformation = data.messages.data.chatRoom;
      this.messages = data.messages.data.messages;
      // Get the last message ID
      this.lastMessageId = this.messages[0].messages[0]._id;

    });
    // Listen for changes to URL params
    this.route.params.subscribe(async (params: any) => {
      if (params.id !== this.chatroomInformation._id) {
        // this.scrollToBottom();
      }
    });

    this.route.queryParamMap.subscribe(async (params: any) => {
      if (params.get('search')) {
        this.showScrollToTop = true;
        this.lastMessageId = params.get('search');
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.IS_BROWSER) {
      this.audioService.audioBlob$.subscribe((audioBlob: any) => {
        this.audioURL = window.URL.createObjectURL(audioBlob);
        this.audioBlob = audioBlob;
        this.cd.detectChanges();
      });
      const element = document.getElementById(this.lastMessageId as string);
      this.infiniteScrollDisabled = true;
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          this.infiniteScrollDisabled = false;
        }, 0);
      } else {
        this.scrollToBottom();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    const lastMessageId = this.messages[0].messages[0]._id;
    const query = {
      limit: 5,
      chatroomId: this.chatroomInformation._id,
      messagesType: 'old',
      messageId: lastMessageId
    };
    this.ngxSpinnerService.show(this.spinner);
    this.infiniteScrollDisabled = true;
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
          this.infiniteScrollDisabled = false;
        }
      }, 0);
      this.ngxSpinnerService.hide(this.spinner);
    });
    // this.prefetchNextPage();
  }

  loadNewMessages(): void {
    // remove search query param
    this.router.navigate([], { queryParams: { search: null }, queryParamsHandling: 'merge' });
    this.showScrollToTop = false;
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
    // console.log('Go back');
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
        this.infiniteScrollDisabled = true;
        // Scroll to bottom of message section
        setTimeout(() => {
          this.messageSection!.nativeElement.scrollTo({
            top: this.messageSection!.nativeElement.scrollHeight,
            behavior: 'smooth'
          });
          this.infiniteScrollDisabled = false;
        }, 100);
      }
    }
  }

  isFirstMessageOfDay(messageGroupIndex: number, meessageGroup: any[]): boolean {
    return messageGroupIndex === 0;
  }

  async deleteChatroom(e: any): Promise<void> {
    e.preventDefault();
    try {
      this.showMenu = false;
      const swalResponse = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this chat!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#dc3545',
        cancelButtonText: 'No, keep it'
      });
      if (swalResponse.isConfirmed) {
        const query = {
          chatroomId: this.chatroomInformation._id
        };
        const response = await this.chatroomService.deleteChatroom(query);
        if (response.success) {
          this.router.navigate(['/chat']);
        }
      }
    } catch (error) {
      Utils.showErrorMessage('Failed to delete chatroom', error);
    }
  }

  async viewUserProfile(): Promise<void> {
    this.userInformation!.user = this.chatroomInformation.participants;
    this.userDetailsService.togglePopup();
    this.showMenu = false;
  }
}
