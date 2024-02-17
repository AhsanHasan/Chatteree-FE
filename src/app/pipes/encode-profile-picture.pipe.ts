import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Pipe({ name: 'encodeProfilePicUrl' })
export class EncodeProfilePictureUrlPipe implements PipeTransform {
    constructor(private authenticationService: AuthenticationService) { }

    transform(url: string): string {
        const userId = this.authenticationService.auth?.user._id as string;
        const urlObject = new URL(url);
        const startIndex = urlObject.pathname.indexOf(userId);
        const encodedSubstring = encodeURIComponent(urlObject.pathname.substring(startIndex));
        return urlObject.href.replace(urlObject.pathname.substring(startIndex), encodedSubstring);
    }
}