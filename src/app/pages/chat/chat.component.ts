import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SearchPeopleService } from './services/search-people.service';
import { AudioRecordService } from './services/audio-record.service';
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
  constructor(
    public authenticationService: AuthenticationService,
    private searchPeopleService: SearchPeopleService,
    public audioService: AudioRecordService
  ) { }

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
}
