export class Utils {
    public static showErrorMessage(message: string, error: any) {
        console.log(message, error);
    }

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static convertBlobImageToFile(blob: Blob, fileName: string): File {
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    }

    public static convertFileToBlob(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
                resolve(blob);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    public async convertObjectURLToFile(objectURL: string, fileName: string): Promise<File> {
        const response = await fetch(objectURL);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    }

    public static extractFilenameFromFirebasePath(path: string): string {
        const pathname = new URL(path).pathname;
        // Use the built-in 'split' method to get the last part after '/'
        const filename = pathname.split('/').pop() as any;
        // Decode the URI component to handle special characters
        const decodedURI = decodeURIComponent(filename).split('/');
        return decodedURI[decodedURI.length - 1];
    }

    public static bufferToWave(abuffer: any, len: number) {
        let numOfChan = abuffer.numberOfChannels,
            length = len * numOfChan * 2 + 44,
            buffer = new ArrayBuffer(length),
            view = new DataView(buffer),
            channels = [],
            i, sample,
            offset = 0,
            pos = 0;
        // write WAVE header
        setUint32(0x46464952);                         // "RIFF"
        setUint32(length - 8);                         // file length - 8
        setUint32(0x45564157);                         // "WAVE"

        setUint32(0x20746d66);                         // "fmt " chunk
        setUint32(16);                                 // length = 16
        setUint16(1);                                  // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2);                      // block-align
        setUint16(16);                                 // 16-bit (hardcoded in this demo)

        setUint32(0x61746164);                         // "data" - chunk
        setUint32(length - pos - 8);                   // chunk length
        for (i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {             // interleave channels
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
                view.setInt16(pos, sample, true);          // write 16-bit sample
                pos += 2;
            }
            offset++                                     // next source sample
        }
        return new Blob([buffer], { type: "audio/wav" });

        function setUint16(data: any) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data: any) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
    }
}