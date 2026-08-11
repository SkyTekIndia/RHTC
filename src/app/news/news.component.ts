import { Component, OnInit } from '@angular/core';
import { NewsService } from '../_services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { FileHelperService } from '../_helpers';

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
})
export class NewsComponent implements OnInit {
  news: any;
  page;
  pageSize = 1;
  currentPageSize = 25;
  collectionSize;
  constructor(private router: Router,
    private alertService$: ToastrService,
    private newsService$: NewsService,
    private fileHelper$: FileHelperService) {
  }

  ngOnInit() {
    this.getNewsList(); 
  }

  onPageChange(page) {
    this.getNewsList(page);
  }

  async getNewsList(page=1) {
    this.news = await this.newsService$.getList(page);
    if(this.news){
      this.collectionSize =  this.news.totalCount;
      this.page = (this.news.currentPage) ? this.news.currentPage: 1;
      this.pageSize =  this.news.perPage;
      this.currentPageSize = this.pageSize * (page - 1);
    }
  }

  onAdd() {
    this.router.navigate([`/add-news`]);
  }

  onViewGallery() {
    this.router.navigate([`/admin-gallery`]);
  }

  OnView(url) {
    window.open(url, "_blank");
  }

  OnDelete(id) {
    this.newsService$.deleteNews(id).subscribe(res => {
      if(res) {
        this.alertService$.success(`Deleted successfully`);
        this.getNewsList();
      }
    })
  }
}

