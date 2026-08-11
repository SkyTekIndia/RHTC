import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../_services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-admin-gallery",
  templateUrl: "./admin-gallery.component.html",
})
export class AdminGalleryComponent implements OnInit {
  galleries: any;
  page;
  pageSize = 1;
  currentPageSize = 25;
  collectionSize;
  constructor(private router: Router,
    private alertService$: ToastrService,
    private galleryService$: GalleryService) {
  }

  ngOnInit() {
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
  }

  onAdd() {
    this.router.navigate([`/add-gallery`]);
  }

  onBack() {
    this.router.navigate([`/news`]);
  }

  OnView(url) {
    window.open(url, "_blank");
  }

  OnDelete(id) {
    this.galleryService$.delete(id).subscribe(res => {
      if(res) {
        this.alertService$.success(`Deleted successfully`);
        this.getGalleryList();
      }
    })
  }
}

