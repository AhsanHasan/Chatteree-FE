import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fav-contacts-slider',
  templateUrl: './fav-contacts-slider.component.html',
  styleUrls: ['./fav-contacts-slider.component.css']
})
export class FavContactsSliderComponent {
  @ViewChild('carouselItems') carouselItems: ElementRef | undefined;

  scrollLeft() {
    // this.carouselItems!.nativeElement.scrollLeft -= this.carouselItems!.nativeElement.clientWidth / 3;
    this.carouselItems!.nativeElement.scrollTo({
      left: this.carouselItems!.nativeElement.scrollLeft - this.carouselItems!.nativeElement.clientWidth / 3,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    // Scroll by 1/3 of the width to show the next item partially and make it smooth
    this.carouselItems!.nativeElement.scrollTo({
      left: this.carouselItems!.nativeElement.scrollLeft + this.carouselItems!.nativeElement.clientWidth / 3,
      behavior: 'smooth'
    });
  }
}
