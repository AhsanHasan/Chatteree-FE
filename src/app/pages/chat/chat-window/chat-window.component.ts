import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AudioRecordService } from '../services/audio-record.service';
import { SearchPeopleService } from '../services/search-people.service';
import { Chatroom } from '../interfaces/chatroom.interface';
import { Message } from '../interfaces/message.interface';
import { MessageService } from '../services/message.service';
import { Utils } from 'src/app/utils';
import { NgxPusherService } from 'ngx-pusher';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnChanges {
  @Input() selectedParticipant: any;
  @Input() selectedChatroomId: any;
  message = '';
  showAudioPopup = false;
  audioBlob: any;
  showEmojiPopup = false;
  showAttachmentPopup = false;
  chatRooms: Chatroom[] = [];
  messages: Message[] = [];
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    public audioService: AudioRecordService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    private pusherService: NgxPusherService
  ) {
    this.route.data.subscribe((data: any) => {
      this.chatRooms = data.chatrooms.data.chatRooms;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedChatroomId'] && changes['selectedChatroomId'].currentValue !== changes['selectedChatroomId'].previousValue) {
      if (this.selectedChatroomId) {
        this.getChatroomMessages(null);
        const channel = this.pusherService.listen('new-message', `chat-room-${this.selectedChatroomId}`);
        channel.subscribe((data: any) => {
          this.getChatroomMessages(null);
        });
      }
    }
  }

  openSearchPeopleModal(): void {
    this.searchPeopleService.togglePopup();
  }

  addEmoji($event: any): void {
    console.log($event);
    this.message += $event.emoji.native;
  }

  onFileSelected(event: any): void {
    console.log(event);
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

}
