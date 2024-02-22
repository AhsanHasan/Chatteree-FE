import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { Utils } from 'src/app/utils';

@Injectable()
export class AudioRecordService {
    mediaRecorder: any;
    audioChunks: any[] = [];
    isRecording = false;
    recordingStartTime: number = 0;
    recordingDuration: number = 0;
    recordingTimer: any;

    private chunks: any[] = [];
    private audioContext: any;
    private audioBlobSubject = new Subject<Blob>();

    audioBlob$ = this.audioBlobSubject.asObservable();

    constructor(
        @Inject(PLATFORM_ID) private platformId: object
    ) { 
        if (isPlatformBrowser(this.platformId)) {
            this.audioContext = new window.AudioContext();
        }
    }

    // Get recording duration
    getRecordingDuration(): string {
        const minutes = Math.floor(this.recordingDuration / 60);
        const seconds = this.recordingDuration % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    async startRecording() {
        this.recordingStartTime = Date.now();
        this.recordingTimer = setInterval(() => {
            this.recordingDuration++;
        }, 1000);
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: any) => this.chunks.push(event.data);
        this.mediaRecorder.start();
    }

    async stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.onstop = async () => {
                const audioData = await new Blob(this.chunks).arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(audioData);
                const wavBlob = Utils.bufferToWave(audioBuffer, audioBuffer.length);
                this.audioBlobSubject.next(wavBlob);
                this.chunks = [];
            };
            clearInterval(this.recordingTimer);
            this.recordingDuration = 0;
            this.mediaRecorder.stop();
        }
    }

}