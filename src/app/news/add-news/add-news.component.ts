import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FileHelperService } from './../../_helpers';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: "app-add-news",
  templateUrl: "./add-news.component.html",
})
export class AddNewsComponent implements OnInit {
  focus;
  lastestNewsForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertService$: ToastrService,
    private newsService$: NewsService,
    private fileHelper$: FileHelperService) { }

  ngOnInit() {
    this.lastestNewsForm = this.fb.group({
      title: [null, [Validators.required]],
      associatedFile: [null]
    });
  }

  // convenience getter for easy access to form fields
  get form() { return this.lastestNewsForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.lastestNewsForm.invalid) {
      return;
    }

    let fileData = this.lastestNewsForm.get('associatedFile')?.value;

    if (fileData) {
      const { location: fileUrl = null  } = await this.uploadFile(fileData).toPromise();
      this.lastestNewsForm.get('associatedFile').setValue(fileUrl);
    }

    this.newsService$.addNews(this.lastestNewsForm.value).subscribe(res => {
      if(res) {
        this.alertService$.success(`Latest new upload successfully`);
        this.onBack();
      }
    });
  }

  async preview(files, type) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.alertService$.error(`Only images and pdf are allowed to upload`);
      this.lastestNewsForm.get(type).setValue(null);
      return;
    }

    this.streamToBase64(type, files[0]);
  }

  streamToBase64(type, file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.lastestNewsForm.get(type).setValue(file);
    }
  }

  private uploadFile(file): Observable<any> {
    var formData: any = new FormData();
    formData.append("image", file);
    return this.fileHelper$.fileUpload(formData);
  }

  onBack() {
    this.router.navigate([`/news`]);
  }
}
