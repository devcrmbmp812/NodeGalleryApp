import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Gallery, GalleryItem, ImageItem } from './gallery/core';
import { Lightbox } from './gallery/lightbox';

@Component({
  selector: 'app-root' ,
      moduleId: module.id,

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}

