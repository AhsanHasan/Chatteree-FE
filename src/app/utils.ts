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

    public static extractFilenameFromFirebasePath(path: string): string {
        const pathname = new URL(path).pathname;
        // Use the built-in 'split' method to get the last part after '/'
        const filename = pathname.split('/').pop() as any;
        // Decode the URI component to handle special characters
        const decodedURI = decodeURIComponent(filename).split('/');
        return decodedURI[decodedURI.length - 1];
    }
}