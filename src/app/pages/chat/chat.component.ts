import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SearchPeopleService } from './services/search-people.service';
import { AudioRecordService } from './services/audio-record.service';
import { User } from 'src/app/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/interfaces/pagination.interface';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  dropdownOpen = false;
  showEmojiPopup = false;
  showAttachmentPopup = false;
  showAudioPopup = false;
  audioBlob: any;
  message = '';
  users: Array<User> = [];
  pagination: Pagination = {
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    public audioService: AudioRecordService,
    private route: ActivatedRoute
  ) { 
    this.route.data.subscribe((data: any) => {
      this.users = data.users.data.users;
      this.pagination = data.users.data.pagination;
    });
  }

  ngOnInit() { }

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

  logout(): void {
    this.authenticationService.logout();
  }
}
