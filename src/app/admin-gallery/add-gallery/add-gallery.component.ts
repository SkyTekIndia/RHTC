import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FileHelperService } from '../../_helpers';
import { ToastrService } from 'ngx-toastr';
import { GalleryService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: "app-add-gallery",
  templateUrl: "./add-gallery.component.html",
})
export class AddGalleryComponent implements OnInit {
  focus;
  GalleryForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertService$: ToastrService,
    private galleryService$: GalleryService,
    private fileHelper$: FileHelperService) { }

  ngOnInit() {
    this.GalleryForm = this.fb.group({
      title: [null, [Validators.required]],
      associatedFile: [null, [Validators.required]],
      isHome: [false, [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get form() { return this.GalleryForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.GalleryForm.invalid) {
      return;
    }

    let fileData = this.GalleryForm.get('associatedFile')?.value;

    if (fileData) {
      const { location: fileUrl = null } = await this.uploadFile(fileData).toPromise();
      this.GalleryForm.get('associatedFile').setValue(fileUrl);
    }

    this.galleryService$.addGallery(this.GalleryForm.value).subscribe(res => {
      if(res) {
        this.alertService$.success(`New Image upload successfully`);
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
      this.GalleryForm.get(type).setValue(null);
      return;
    }

    this.streamToBase64(type, files[0]);
  }

  streamToBase64(type, file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.GalleryForm.get(type).setValue(file);
    }
  }

  private uploadFile(file): Observable<any> {
    var formData: any = new FormData();
    formData.append("image", file);
    return this.fileHelper$.fileUpload(formData);
  }

  onBack() {
    this.router.navigate([`/admin-gallery`]);
  }
}
