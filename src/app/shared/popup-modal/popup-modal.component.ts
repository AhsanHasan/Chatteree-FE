import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopupModalService } from 'src/app/services/popup-modal.service';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.css']
})
export class PopupModalComponent {
  @Input() title: string | undefined;
  @Input() message: string | undefined;
  @Input() showCancel: boolean | undefined;
  @Input() confirmText: string | undefined;
  @Input() cancelText: string | undefined;
  @Input() type: 'warning' | 'info' | 'error' | 'success' | 'confirmation' | 'custom' = 'info';
  @Output() confirmationResult: EventEmitter<ConfirmationResponse> = new EventEmitter<ConfirmationResponse>();

  constructor(
    private popupService: PopupModalService
  ) {}

  get PoupModalVisibility$(): any {
    return this.popupService.modalVisibility$;
  }

  closePopup(): void {
    this.popupService.togglePopup();
  }

  sendResponse(status: string): void {
    switch (status) {
      case 'confirmed':
        this.confirmationResult.emit({ isConfirmed: true, isCancelled: false });
        break;
      case 'cancelled':
        this.confirmationResult.emit({ isConfirmed: false, isCancelled: true });
        break;
      default:
        break;
    }
    this.closePopup();
  }
}

export interface ConfirmationResponse {
  isConfirmed: boolean;
  isCancelled: boolean;
}