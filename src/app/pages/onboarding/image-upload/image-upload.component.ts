import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CropperModalService } from 'src/app/services/cropper-modal.service';
import { CropperModalComponent } from 'src/app/shared/cropper-modal/cropper-modal.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Utils } from 'src/app/utils';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/services/loader.service';
import { GeneralInformationService } from './services/general-information.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('cropperModal') cropperModal: CropperModalComponent | undefined;
  uploadedFileName: string = '';
  imageUrl: string = this.authenticationService.auth?.user.profilePicture || '';
  uploadedFile: File | undefined;
  maxNameLength = 18;
  enteredName = this.authenticationService.auth?.user.name || '';
  currentNameLength = this.maxNameLength;
  userInformation: UserInformation = {
    name: '',
    profilePicture: '',
    _id: this.authenticationService.auth?.user._id as string
  };
  constructor(
    private cropperModalService: CropperModalService,
    private fireStorage: AngularFireStorage,
    private authenticationService: AuthenticationService,
    private ngxSpinnerService: NgxSpinnerService,
    private loaderService: LoaderService,
    private generalInformationService: GeneralInformationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateNameLength();
    if (this.authenticationService.auth?.user.profilePicture) {
      this.imageUrl = this.authenticationService.auth?.user.profilePicture;
    }
  }

  ngAfterViewInit(): void {
  }

  async submitForm(generalInfoForm: NgForm): Promise<void> {
    try {
      if (generalInfoForm.invalid) {
        return;
      }
      // Check if the user has uploaded a file
      if (!this.uploadedFile && (!this.imageUrl || this.imageUrl === '')) {
        throw new Error('Please upload a file');
      }
      this.loaderService.updateValue('Uploading profile picture...')
      this.ngxSpinnerService.show();
      // Upload the file to firebase storage
      const path = `${this.authenticationService.auth?.user._id}/profile-image/${this.uploadedFile?.name}`;
      const uploadResponse = await this.fireStorage.upload(path, this.uploadedFile as File);
      const downloadURL = await uploadResponse.ref.getDownloadURL();
      this.userInformation.profilePicture = downloadURL;
      this.userInformation.name = generalInfoForm.value.name;
      this.loaderService.updateValue('Saving information...')

      // Call the API to update the user's profile picture and name
      const response = await this.generalInformationService.saveUsername(this.userInformation);
      if (response.success) {
        // Update cookie with new user information
        await this.authenticationService.setUserData({
          _id: this.authenticationService.auth?.user._id as string,
          email: this.authenticationService.auth?.user.email as string,
          name: this.userInformation.name,
          username: this.authenticationService.auth?.user.username as string,
          profilePicture: this.userInformation.profilePicture,
          isActive: true,
          onlineStatus: 'online'
        });
        this.router.navigate(['/chat']);
      }

    } catch (error) {
      Utils.showErrorMessage('Error submitting form', error);
    }
    this.ngxSpinnerService.hide();
  }

  triggerCropper($event: any): void {
    this.cropperModal?.triggerCropper($event);
    this.cropperModalService.togglePopup();
  }

  async getFile(imageFile: any): Promise<void> {
    this.imageUrl = this.getObjectURL(imageFile.file);
    this.uploadedFile = imageFile.file;
  }

  getObjectURL(file: File): string {
    if (file) {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating object URL:', error);
      }
    }

    return '';
  }

  resetFileInput(event: Event) {
    (event.target as HTMLInputElement).value = '';
  }

  updateNameLength(): void {
    if (this.enteredName.length === 0) {
      this.currentNameLength = this.maxNameLength;
    } else {
      this.currentNameLength = this.enteredName.length;
    }
  }

}

export interface UserInformation {
  _id: string;
  name: string;
  profilePicture: string;
}