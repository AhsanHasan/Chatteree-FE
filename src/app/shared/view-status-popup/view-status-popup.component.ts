import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewStatusPopupService } from './view-status-popup.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-status-popup',
  templateUrl: './view-status-popup.component.html',
  styleUrls: ['./view-status-popup.component.css']
})
export class ViewStatusPopupComponent implements OnInit, OnChanges {
  spinner = 'statusSpinner';
  statusSubscription?: Subscription;
  statusVideos: any[] = [];
  previewVideo = '';
  constructor(
    private viewStatusPopupService: ViewStatusPopupService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.statusSubscription = this.viewStatusPopupService.statusObservable.subscribe((status: any) => {
      if (status) {
        this.statusVideos = status?.statuses;
        this.previewVideo = this.statusVideos[0]?.url;
        this.cd.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get poupModalVisibility$(): any {
    return this.viewStatusPopupService.modalVisibility$;
  }

  closePopup(): void {
    this.viewStatusPopupService.togglePopup();
  }

  get preview() {
    return this.previewVideo;
  }

  get statusVideosList() {
    return this.statusVideos;
  }
}
