import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { GalleryService } from '../_services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  galleries: any;
  page;
  pageSize = 1;
  currentPageSize = 100;
  collectionSize;

  constructor(
    private galleryService$: GalleryService
  ) { }

  ngOnInit(): void {

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.getGalleryList(); 
  }

  onPageChange(page) {
    this.getGalleryList(page);
  }

  async getGalleryList(page=1) {
    this.galleries = await this.galleryService$.getList(page);
    if(this.galleries){
      this.collectionSize =  this.galleries.totalCount;
      this.page = (this.galleries.currentPage) ? this.galleries.currentPage: 1;
      this.pageSize =  this.galleries.perPage;
      this.currentPageSize = this.pageSize * (page - 1);
    }

    this.galleryImages = [];

    if(this.galleries?.list?.length) {
      this.galleries.list.map(async gallery => {
        const { associatedFile: fileUrl = null } = gallery;
        if(fileUrl) {
          this.galleryImages.push({
            small: fileUrl,
            medium: fileUrl,
            big: fileUrl,
          });
        }
      })
    }
  }
}
