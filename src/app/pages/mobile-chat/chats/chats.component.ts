import { Component } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  slides = [
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_640.png" },
    { img: "https://cdn.pixabay.com/photo/2014/03/25/16/24/female-296989_640.png" }
  ];
  slideConfig = {
    'slidesToShow': 3,
    'slidesToScroll': 1,
    'arrows': false,
    'variableWidth': true
  };


  addSlide() {
    this.slides.push({ img: "http://placehold.it/350x150/777777" })
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }
}
