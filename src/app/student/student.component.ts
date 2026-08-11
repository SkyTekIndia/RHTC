import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit {
    formResponse:any = {};
    selectedReg;
    basicDetails;
    currentYear = new Date().getFullYear();
    regTags = [
        {
            id: 'basicdetails',
            heading: 'Basic Details',
            subheading: 'Personal Information'
        },
        {
            id: 'educationalqualifications',
            heading: 'Educational Qualifications',
            subheading: 'Details of 10th & 10+2'
        },
        {
            id: 'uploadphotosignature',
            heading: 'Upload Photo & Signature',
            subheading: 'Photo & Signature'
        },
        {
            id: 'uploadotherdocuments',
            heading: 'Upload Other Documents',
            subheading: 'Certificate & IDs'
        },
        {
            id: 'applicationpreview',
            heading: 'Application Preview',
            subheading: 'Preview & Submit'
        },
        {
            id: 'declarationpayment',
            heading: 'Declaration & Payment',
            subheading: 'Declaration & Fee payment'
        }
    ];

    constructor() {
        this.selectedReg = 'basicdetails';
    }

    ngOnInit() {}

    getFormResponse(response: any) {
        switch (Object.keys(response)[0]) {
            case 'basicdetails':
                this.formResponse = Object.assign(this.formResponse, response);
                this.selectedReg = 'educationalqualifications';
                break;
            case 'educationalqualifications':
                this.formResponse = Object.assign(this.formResponse, response);
                this.selectedReg = 'uploadphotosignature';
                break;
            case 'uploadphotosignature':
                this.formResponse = Object.assign(this.formResponse, response);
                this.selectedReg = 'uploadotherdocuments';                
                this.basicDetails = this.formResponse.basicdetails;
                break;
            case 'uploadotherdocuments':
                this.formResponse = Object.assign(this.formResponse, response);
                this.selectedReg = 'applicationpreview';
                break;
            case 'applicationpreview':
                this.formResponse = Object.assign(this.formResponse, response.applicationpreview);
                this.selectedReg = 'declarationpayment';
                break;
            case 'declarationpayment':
                this.formResponse = Object.assign(this.formResponse, response.preview);
                break;
        }
    }

    onRegChange(id) {
        this.selectedReg = id;
    }

    isSideMenuDisabled(id) {
        if (id === 'basicdetails' || this.selectedReg === id) {
            return false;
        }
        return !this.formResponse.hasOwnProperty(id);
    }
}
