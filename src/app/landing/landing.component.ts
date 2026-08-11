import { Component, OnInit } from '@angular/core';
import { GalleryService, NewsService } from '../_services';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;
  isRegAllowed: boolean =  false;
  isAdmitDownloadAllowed: boolean = false;
  news: {
    list: []
  };

  lastestNews = [];
  galleryImages = [];

  galleries: any;
  page;
  pageSize = 1;
  currentPageSize = 100;
  collectionSize;

  constructor(
    private newsService$: NewsService,
    private galleryService$: GalleryService
    ) { }

  ngOnInit() {
    const currentTime = new Date().getTime();

    // if (currentTime > 1657218599000 && currentTime < 1660156199000) {
      this.isRegAllowed = true;
    // }

    // if(currentTime > 1660415399000 && currentTime < 1661020199000) {
    //   this.isAdmitDownloadAllowed = false;
    // }

    this.getNewsList(); 
    this.getGalleryList(); 
  }

  async getNewsList(page=1) {
    this.news = await this.newsService$.getList(page);

    if (this.news) {
      if (this.news?.list?.length) {
        this.lastestNews = this.news.list.filter(record => {
          const { associatedFile } = record;
          return associatedFile;
        });
      }
    }
  }

  OnView(url) {
    window.open(url, "_blank");
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

    if(this.galleries?.list?.length) {
      this.galleries.list.filter(data => data.isHome).map(async gallery => {
        const { associatedFile: fileUrl = null } = gallery;
        this.galleryImages.push(fileUrl);
      });
    }
  }
}
