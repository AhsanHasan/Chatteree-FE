import { Injectable } from '@angular/core';

@Injectable()
export class AudioRecordService {
    mediaRecorder: any;
    audioChunks: any[] = [];
    isRecording = false;
    recordingStartTime: number = 0;
    recordingDuration: number = 0;
    recordingTimer: any;

    constructor() { }

    // Start recording
    startRecording(): void {
        this.audioChunks = [];
        this.recordingStartTime = Date.now();
        this.recordingDuration = 0;
        this.recordingTimer = setInterval(() => {
            this.recordingDuration++;
        }, 1000);
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
            this.isRecording = true;
            this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
                console.log(event.data);
                this.audioChunks.push(event.data);
            });
        });
    }

    // Stop recording
    stopRecording(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mediaRecorder.addEventListener('stop', () => {
                this.isRecording = false;
                clearInterval(this.recordingTimer);
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                resolve(audioBlob);
            });
            this.mediaRecorder.stop();
        });
    }

    // Get recording duration
    getRecordingDuration(): string {
        const minutes = Math.floor(this.recordingDuration / 60);
        const seconds = this.recordingDuration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}