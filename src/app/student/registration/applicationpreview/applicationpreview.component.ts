import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FileHelperService } from './../../../_helpers';

@Component({
    selector: 'app-applicationpreview',
    templateUrl: './applicationpreview.component.html'
})

export class ApplicationPreviewComponent implements OnInit {

    @Input() draftForm: any;
    applicationPreviewForm: FormGroup;
    loading = false;
    submitted = false;
    photoURL: any;
    signURL: any;
    aadharCertificateURL: any;
    tenthCertificateURL: any;
    twelfthCertificateURL: any;
    casteCertificateURL: any;
    characterCertificateURL: any;
    twelfthAdCertificateURL: any;

    @Output() formResponse = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
        private fileHelper$: FileHelperService) { }

    ngOnInit() {
        this.applicationPreviewForm = this.fb.group({
            preview: [this.draftForm, [Validators.required]]
        });

        this.setPictures();
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.applicationPreviewForm.invalid) {
            return;
        }

        let response = {
            applicationpreview: this.applicationPreviewForm.value.preview
        }

        this.formResponse.emit(response);
    }

    async setPictures() {

        const fileArray = [
            this.fileHelper$.getFile(this.draftForm.uploadphotosignature.photo),
            this.fileHelper$.getFile(this.draftForm.uploadphotosignature.sign),
            this.fileHelper$.getFile(this.draftForm.uploadotherdocuments.aadharCertificate),
            this.fileHelper$.getFile(this.draftForm.uploadotherdocuments.tenthCertificate),
            this.fileHelper$.getFile(this.draftForm.uploadotherdocuments.twelfthCertificate),
            this.fileHelper$.getFile(this.draftForm.uploadotherdocuments.characterCertificate)
        ];

        if (this.draftForm.uploadotherdocuments.casteCertificate) {
            fileArray.push(this.fileHelper$.getFile(this.draftForm.uploadotherdocuments.casteCertificate))
        }

        if (this.draftForm.uploadotherdocuments.twelfthAdCertificate) {
            fileArray.push(this.fileHelper$.getFile(this.draftForm.uploadotherdocuments.twelfthAdCertificate))
        }

        const URL = await Promise.all(fileArray);

        //set images 
        this.streamToBase64('photo', URL[0]);
        this.streamToBase64('sign', URL[1]);
        this.streamToBase64('aadharCertificate', URL[2]);
        this.streamToBase64('tenthCertificate', URL[3]);
        this.streamToBase64('twelfthCertificate', URL[4]);  
        this.streamToBase64('characterCertificate', URL[5]);

        if(URL[6]) {
            this.streamToBase64('casteCertificate', URL[6]);
        }

        if(URL[7]) {
            this.streamToBase64('twelfthAdCertificate', URL[7]);
        }
    }

    streamToBase64(type, file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.setPreviewImage(reader.result, type);
        }
    }

    setPreviewImage(url, type) {
        switch (type) {
            case 'photo':
                this.photoURL = url;
                break;
            case 'sign':
                this.signURL = url;
                break;
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
    }
}
