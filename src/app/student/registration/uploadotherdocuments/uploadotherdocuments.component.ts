import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FileHelperService } from './../../../_helpers';

@Component({
    selector: 'app-uploadotherdocuments',
    templateUrl: './uploadotherdocuments.component.html'
})

export class UploadOtherDocumentsComponent implements OnInit {
    focus;
    @Input() draftForm: any;
    @Input() basicDetails: any;
    aadharCertificateURL: any;
    tenthCertificateURL: any;
    twelfthCertificateURL: any;
    casteCertificateURL: any;
    characterCertificateURL: any;
    twelfthAdCertificateURL: any;

    uploadResponse: any;
    public message: string;

    uploadOtherDocumentsForm: FormGroup;
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

    preview(files, type) {
        if (files.length === 0)
            return;

        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }

        if (files[0].size / 1024 > 500) {
            this.message = "Image size should be less then 500KB";
            return;
        }

        this.streamToBase64(type, files[0]);
    }

    // convenience getter for easy access to form fields
    get form() { return this.uploadOtherDocumentsForm.controls; }

    onSubmit() {
        this.submitted = true;

        if(this.basicDetails.category === 'UR') {
            this.uploadOtherDocumentsForm.get('casteCertificate').setErrors(null);
            this.uploadOtherDocumentsForm.updateValueAndValidity();
        }

        // stop here if form is invalid
        if (this.uploadOtherDocumentsForm.invalid) {
            return;
        }

        let aadharCertificate = this.uploadOtherDocumentsForm.get('aadharCertificate').value;
        let tenthCertificate = this.uploadOtherDocumentsForm.get('tenthCertificate').value;
        let twelfthCertificate = this.uploadOtherDocumentsForm.get('twelfthCertificate').value;
        let casteCertificate = this.uploadOtherDocumentsForm.get('casteCertificate').value;
        let characterCertificate = this.uploadOtherDocumentsForm.get('characterCertificate').value;
        let twelfthAdCertificate = this.uploadOtherDocumentsForm.get('twelfthAdCertificate').value;

        if (typeof aadharCertificate === 'object') {
            let fileArray = [];
            aadharCertificate = this.uploadFile(this.uploadOtherDocumentsForm.get('aadharCertificate').value);
            tenthCertificate = this.uploadFile(this.uploadOtherDocumentsForm.get('tenthCertificate').value);
            twelfthCertificate = this.uploadFile(this.uploadOtherDocumentsForm.get('twelfthCertificate').value);
            characterCertificate = this.uploadFile(this.uploadOtherDocumentsForm.get('characterCertificate').value);

            fileArray.push(aadharCertificate);
            fileArray.push(tenthCertificate);
            fileArray.push(twelfthCertificate);  
            fileArray.push(characterCertificate);

            if (this.uploadOtherDocumentsForm.get('casteCertificate').value) {
                casteCertificate = this.uploadFile(this.uploadOtherDocumentsForm.get('casteCertificate').value);
                fileArray.push(casteCertificate);
            }

            if (this.uploadOtherDocumentsForm.get('twelfthAdCertificate').value) {
                twelfthAdCertificate = this.uploadFile(this.uploadOtherDocumentsForm.get('twelfthAdCertificate').value);
                fileArray.push(twelfthAdCertificate);
            }

            forkJoin(fileArray).subscribe(res => {
                this.uploadResponse = res;
                const casteCertificate = (typeof this.uploadResponse[4] !== 'undefined') ? this.uploadResponse[4].filename : '';
                const twelfthAdCertificate = (typeof this.uploadResponse[5] !== 'undefined') ? this.uploadResponse[5].filename : '';
                this.sendResponse(this.uploadResponse[0].filename, this.uploadResponse[1].filename, this.uploadResponse[2].filename, this.uploadResponse[3].filename, casteCertificate, twelfthAdCertificate)
            });

        } else {
            this.sendResponse(aadharCertificate, tenthCertificate, twelfthCertificate, characterCertificate, casteCertificate, twelfthAdCertificate);
        }
    }

    private uploadFile(file): Observable<any> {
        var formData: any = new FormData();
        formData.append("image", file);
        return this.fileHelper$.fileUpload(formData);
    }

    private sendResponse(aadharCertificate, tenthCertificate, twelfthCertificate, characterCertificate, casteCertificate, twelfthAdCertificate) {
        let response = {
            uploadotherdocuments: {
                aadharCertificate: aadharCertificate,
                tenthCertificate: tenthCertificate,
                twelfthCertificate: twelfthCertificate,
                casteCertificate: casteCertificate,
                characterCertificate: characterCertificate,
                twelfthAdCertificate: twelfthAdCertificate
            }
        }
        this.formResponse.emit(response);
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
        switch (type) {
            case 'aadharCertificate':
                this.aadharCertificateURL = url;
                break;
            case 'tenthCertificate':
                this.tenthCertificateURL = url;
                break;
            case 'twelfthCertificate':
                this.twelfthCertificateURL = url;
                break;
            case 'casteCertificate':
                this.casteCertificateURL = url;
                break;
            case 'characterCertificate':
                this.characterCertificateURL = url;
                break;
            case 'twelfthAdCertificate':
                this.twelfthAdCertificateURL = url;
                break;
        }
        this.uploadOtherDocumentsForm.get(type).setValue(file);
    }

    async updatedForm() {
        this.uploadOtherDocumentsForm = this.fb.group({
            aadharCertificate: [this.draftForm.aadharCertificate, [Validators.required]],
            tenthCertificate: [this.draftForm.tenthCertificate, [Validators.required]],
            twelfthCertificate: [this.draftForm.twelfthCertificate, [Validators.required]],
            casteCertificate: [this.draftForm.casteCertificate],
            characterCertificate: [this.draftForm.characterCertificate, [Validators.required]],
            twelfthAdCertificate: [this.draftForm.twelfthAdCertificate]
        });

        const getFileArray = [
            this.fileHelper$.getFile(this.draftForm.aadharCertificate),
            this.fileHelper$.getFile(this.draftForm.tenthCertificate),
            this.fileHelper$.getFile(this.draftForm.twelfthCertificate),
            this.fileHelper$.getFile(this.draftForm.characterCertificate)
        ];

        if(this.draftForm.casteCertificate) {
            getFileArray.push(this.fileHelper$.getFile(this.draftForm.casteCertificate))
        }

        if(this.draftForm.twelfthAdCertificate) {
            getFileArray.push(this.fileHelper$.getFile(this.draftForm.twelfthAdCertificate))
        }

        const URL = await Promise.all(getFileArray);

        //set images 
        this.streamToBase64('aadharCertificate', URL[0]);
        this.streamToBase64('tenthCertificate', URL[1]);
        this.streamToBase64('twelfthCertificate', URL[2]);
        this.streamToBase64('characterCertificate', URL[3]);

        if(URL[4]) {
            this.streamToBase64('casteCertificate', URL[4]);
        }

        if(URL[5]) {
            this.streamToBase64('twelfthAdCertificate', URL[5]);
        }
    }

    newForm() {
        this.uploadOtherDocumentsForm = this.fb.group({
            aadharCertificate: [null, [Validators.required]],
            tenthCertificate: [null, [Validators.required]],
            twelfthCertificate: [null, [Validators.required]],
            casteCertificate: [null],
            characterCertificate: [null, [Validators.required]],
            twelfthAdCertificate: [null]
        });
    }
}
