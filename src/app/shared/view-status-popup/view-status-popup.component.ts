import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ViewStatusPopupService } from './view-status-popup.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Utils } from 'src/app/utils';
import { StatusService } from 'src/app/pages/mobile-chat/services/status.service';

@Component({
  selector: 'app-view-status-popup',
  templateUrl: './view-status-popup.component.html',
  styleUrls: ['./view-status-popup.component.css']
})
export class ViewStatusPopupComponent implements OnInit, OnChanges {
  @Output() closePopupEvent = new EventEmitter<any>();
  spinner = 'statusSpinner';
  statusSubscription?: Subscription;
  statusVideos: any[] = [];
  previewStatus: any;
  currentIndex = 0;
  viewedStatus: Array<any> = [];
  userId = null;
  constructor(
    private viewStatusPopupService: ViewStatusPopupService,
    private cd: ChangeDetectorRef,
    private statusService: StatusService
  ) { }

  ngOnInit(): void {
    this.statusSubscription = this.viewStatusPopupService.statusObservable.subscribe((status: any) => {
      if (status) {
        this.userId = status._id;
        this.statusVideos = status?.statuses;
        if (!this.statusVideos[0].isViewed) {
          this.viewedStatus.push(this.statusVideos[this.currentIndex]._id);
        }
        this.cd.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get poupModalVisibility$(): any {
    return this.viewStatusPopupService.modalVisibility$;
  }

  async closePopup(): Promise<void> {
    // Update view status on modal close
    await this.viewStatus();
    this.closePopupEvent.emit(true);
    this.viewStatusPopupService.togglePopup();
  }

  async viewStatus(): Promise<void> { 
    try {
      const body = {
        statusIds: this.viewedStatus,
        userId: this.userId
      };
      const response = await this.statusService.viewStatus(body);
      if (response && response.success) {
        console.log('Status viewed');
      }
    } catch (error) {
      Utils.showErrorMessage('Error viewing status', error);
    }
  }

  nextSlide() {
    if (this.currentIndex < this.statusVideos.length - 1) {
      this.currentIndex++;
      this.addStatusToViewed(this.statusVideos[this.currentIndex]);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.addStatusToViewed(this.statusVideos[this.currentIndex]);
    }
  }

  showSlide(index: number) {
    const slides = document.querySelectorAll('.my-slides') as NodeListOf<HTMLElement>;
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  addStatusToViewed(status: any) {
    if (!this.viewedStatus.includes(status._id) && !status.isViewed) {
      this.viewedStatus.push(status._id);
    }
  }
}
