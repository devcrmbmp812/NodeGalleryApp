import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Gallery, GalleryItem, ImageItem } from '../gallery/core';
import { Lightbox } from '../gallery/lightbox';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  items: GalleryItem[];

  imageData = [
    {
      srcUrl: '../assets/img1.jpg',
      previewUrl: '../assets/img1.jpg'
    },
    {
     srcUrl: '../assets/img2.jpg',
      previewUrl: '../assets/img2.jpg'
    },
    {
      srcUrl: '../assets/img3.jpg',
      previewUrl: '../assets/img3.jpg'
    },
    {
      srcUrl: '../assets/img4.jpg',
      previewUrl: '../assets/img4.jpg'
    }
  ];
  private  logged : boolean ;

  constructor(public gallery: Gallery, public lightbox: Lightbox) {
    this.logged = false;
  }

  ngOnInit() {
    // This is for Basic example
    this.items = this.imageData.map(item => {
      return new ImageItem(item.srcUrl, item.previewUrl);
    });

    // This is for Lightbox example
    this.gallery.ref('lightbox').load(this.items);
  }
}

