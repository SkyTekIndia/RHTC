import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileHelperService } from './../../../_helpers';
import { Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-uploadphotosignature',
    templateUrl: './uploadphotosignature.component.html'
})

export class UploadPhotoSignatureComponent implements OnInit {
    focus;
    @Input() draftForm: any;
    photoURL: any;
    signURL: any;
    uploadResponse: any;
    public message: string;

    uploadPhotoSignatureForm: FormGroup;
    loading = false;
    submitted = false;
    @Output() formResponse = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private fileHelper$: FileHelperService) { }

    ngOnInit() {
        if (this.draftForm) {
            this.updatedForm();
        } else {
            this.newForm();
        }
    }

    async preview(files, type) {
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }

        if (files[0].size / 1024 > 200) {
            this.message = "Image size should be less then 200KB";
            return;
        }

        this.streamToBase64(type, files[0]);      
    }

    // convenience getter for easy access to form fields
    get form() { return this.uploadPhotoSignatureForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.uploadPhotoSignatureForm.invalid) {
            return;
        }

        let photo = this.uploadPhotoSignatureForm.get('photo').value;
        let sign = this.uploadPhotoSignatureForm.get('sign').value;

        if (typeof photo === 'object') {
            photo = this.uploadFile(this.uploadPhotoSignatureForm.get('photo').value);
            sign = this.uploadFile(this.uploadPhotoSignatureForm.get('sign').value);
            forkJoin([photo, sign]).subscribe(res => {
                this.uploadResponse = res;
                this.sendResponse(this.uploadResponse[0].filename, this.uploadResponse[1].filename);
            });
        } else {
            this.sendResponse(photo, sign);
        }
    }

    private sendResponse(photo, sign) {
        let response = {
            uploadphotosignature: {
                photo: photo,
                sign: sign
            }
        }
        this.loading = false;
        this.formResponse.emit(response);
    }

    private uploadFile(file): Observable<any> {
        this.loading = true;
        var formData: any = new FormData();
        formData.append("image", file);
        return this.fileHelper$.fileUpload(formData);
    }

    streamToBase64(type, file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.setPreviewImage(reader.result, type, file);
        }
    }

    setPreviewImage(url, type, file) {
        this.message = '';
        if (type === 'photo') {
            this.photoURL = url;
        } else {
            this.signURL = url;
        }
        this.uploadPhotoSignatureForm.get(type).setValue(file);
    }

    async updatedForm() {
        this.uploadPhotoSignatureForm = this.fb.group({
            photo: [this.draftForm.photo, [Validators.required]],
            sign: [this.draftForm.sign, [Validators.required]]
        });

        const URL = await Promise.all([this.fileHelper$.getFile(this.draftForm.photo), this.fileHelper$.getFile(this.draftForm.sign)]);

        //set images 
        this.streamToBase64('photo', URL[0]);
        this.streamToBase64('sign', URL[1]);
    }

    newForm() {
        this.uploadPhotoSignatureForm = this.fb.group({
            photo: ['', [Validators.required]],
            sign: ['', [Validators.required]]
        });
    }
}
