import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FileHelperService } from '../../_helpers';
import { StudentService } from '../../_services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-applicationview',
    templateUrl: './applicationview.component.html'
})

export class ApplicationViewComponent implements OnInit {
    student: any;
    applicationViewForm: FormGroup;
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
    studentID: any;

    constructor(private fb: FormBuilder,
        private fileHelper$: FileHelperService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private studentService$: StudentService,
        private alertService$: ToastrService) {
        // fetch order details
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            const id = params.get('_id');
            this.getApplication(id);
            this.studentID = id;
        });
    }

    ngOnInit() {
        this.applicationViewForm = this.fb.group({
            rejected: [true, [Validators.required]],
            rejectedReason: [null, [Validators.required]],
            id: [null, [Validators.required]],
        });
    }

    // convenience getter for easy access to form fields
    get form() { return this.applicationViewForm.controls; }

    async onSubmit() {
        this.submitted = true;

        if(this.student.rejected) {
            this.applicationViewForm.get('rejectedReason').setErrors(null);
            this.applicationViewForm.updateValueAndValidity();
        }

        // stop here if form is invalid
        if (this.applicationViewForm.invalid) {
            return;
        }

        const response = await this.studentService$.rejectById(this.applicationViewForm.value);

        if(response.message) {
            this.alertService$.success(response.message, "Success");
            this.router.navigate(['/dashboard']);
        }        
    }

    async getApplication(id) {
        this.student = await this.studentService$.getById(id);
        if (this.student) {
            this.applicationViewForm.get('id').setValue(this.student._id);
            this.setPictures();
        }
    }

    async setPictures() {
        const fileArray = [
            this.fileHelper$.getFile(this.student.uploadphotosignature.photo),
            this.fileHelper$.getFile(this.student.uploadphotosignature.sign),
            this.fileHelper$.getFile(this.student.uploadotherdocuments.aadharCertificate),
            this.fileHelper$.getFile(this.student.uploadotherdocuments.tenthCertificate),
            this.fileHelper$.getFile(this.student.uploadotherdocuments.twelfthCertificate),
            this.fileHelper$.getFile(this.student.uploadotherdocuments.characterCertificate)
        ];

        if (this.student.uploadotherdocuments.casteCertificate) {
            fileArray.push(this.fileHelper$.getFile(this.student.uploadotherdocuments.casteCertificate))
        }

        if (this.student.uploadotherdocuments.twelfthAdCertificate) {
            fileArray.push(this.fileHelper$.getFile(this.student.uploadotherdocuments.twelfthAdCertificate))
        }

        const URL = await Promise.all(fileArray);

        // set images 
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

    viewInZoom(dataURI) {
        var image = new Image();
        image.src = dataURI;
        var w = window.open("");
        w.document.write(image.outerHTML);
    }

    backToDashBoard() {
        this.router.navigate([`/dashboard`], { queryParamsHandling: 'merge' });
    }

    async printApplication() {
        const applicationFile = await this.studentService$.applicationForm({ id: this.studentID });
        const pdfName = (this.student.rollno === 'NA') ? this.student.applicationId : this.student.rollno;
        saveAs(applicationFile, `${pdfName}.pdf`);
    }
}
