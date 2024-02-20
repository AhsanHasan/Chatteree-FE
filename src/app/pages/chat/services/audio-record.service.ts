import { Injectable } from '@angular/core';
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
    private audioContext: AudioContext = new AudioContext();
    private audioBlobSubject = new Subject<Blob>();

    audioBlob$ = this.audioBlobSubject.asObservable();



    constructor() { }

    // Start recording
    _startRecording(): void {
        this.audioChunks = [];
        this.recordingStartTime = Date.now();
        this.recordingDuration = 0;
        this.recordingTimer = setInterval(() => {
            this.recordingDuration++;
        }, 1000);
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.mediaRecorder = new MediaRecorder(stream, {});
            this.mediaRecorder.start();
            this.isRecording = true;
            this.mediaRecorder.addEventListener('dataavailable', (event: any) => {
                console.log(event.data);
                this.audioChunks.push(event.data);
            });
        });
    }

    // Stop recording
    _stopRecording(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mediaRecorder.addEventListener('stop', () => {
                this.isRecording = false;
                clearInterval(this.recordingTimer);
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
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

    async startRecording() {
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

            this.mediaRecorder.stop();
        }
    }

}