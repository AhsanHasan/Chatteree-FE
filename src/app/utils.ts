export class Utils {
    public static showErrorMessage(message: string, error: any) {
        console.log(message, error);
    }

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}