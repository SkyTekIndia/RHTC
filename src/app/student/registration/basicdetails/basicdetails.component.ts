import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/_helpers/dateformat';

@Component({
    selector: 'app-basicdetails',
    templateUrl: './basicdetails.component.html',
    providers: [
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
    ]
})

export class BasicDetailsComponent implements OnInit {
    focus;
    @Input() draftForm: any;
    basicDetailsForm: FormGroup;
    submitted = false;
    minDate = { year: 1980, month: 1, day: 1 };
    currentYear = new Date().getFullYear();
    isRegistrationAllowed: Boolean = false;
    @Output() formResponse = new EventEmitter<any>();

    constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    }

    ngOnInit() {
        const currentTime = Date.now();

        if (currentTime > 1657218599000 && currentTime < 1660156199000) {
            this.isRegistrationAllowed = false;
        } else {
            this.isRegistrationAllowed = true;
        }

        // const tabParam = this.route.snapshot.queryParamMap.get('tab');
        // const modeParam = this.route.snapshot.queryParamMap.get('mode');

        // if (tabParam === "admin" && modeParam === "dev") {
        //     this.isRegistrationAllowed = false;
        // }

        if (this.draftForm) {
            this.updatedForm();
        } else {
            this.newForm();
        }
    }

    // convenience getter for easy access to form fields
    get form() { return this.basicDetailsForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.basicDetailsForm.invalid) {
            return;
        }

        let response = {
            basicdetails: this.basicDetailsForm.value
        }
        this.formResponse.emit(response);
    }

    newForm() {
        this.basicDetailsForm = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]*$/)
            ]],
            fatherName: ['', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]*$/)
            ]],
            motherName: ['', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]*$/)
            ]],
            dob: ['', [Validators.required]],
            age: ['', [Validators.required]],
            category: ['UR', [Validators.required]],
            aadhar: ['', [Validators.required]],
            mobile: ['', [Validators.required]],
            alternateMobile: [''],
            identificationMarks: [''],
            address1: ['', [Validators.required]],
            address2: ['', [Validators.required]],
            stateofDomicile: ['Delhi', [Validators.required]],
            pincode: ['', [
                Validators.required,
                Validators.pattern(/^[11][0-9]{5}$/i)
            ]],
            email: ['', [Validators.required, Validators.email]]
        }, { validator: this.validateDOB });
    }

    onDOBSelected(dob) {
        const { month, year, day } = dob;

        let currentMonth = 12; // December
        let currentDay = 31; //31st
        let age = this.currentYear - year;

        if (currentMonth < month - 1) {
            age--;
        }

        if (month - 1 == currentMonth && currentDay < day) {
            age--;
        }

        this.basicDetailsForm.get('age').setValue(age);
    }


    validateDOB(f: FormGroup) {
        const gen = ['UR', 'PH', 'EWSs'];
        const scst = ['SC', 'ST'];

        const { month, year, day } = f.get('dob').value;
        const category = f.get('category').value;


        let currentMonth = 12;
        let currentDay = 31;
        let age = new Date().getFullYear() - year;

        if (currentMonth < month - 1) {
            age--;
        }

        if (month - 1 == currentMonth && currentDay < day) {
            age--;
        }

        if (gen.includes(category)) {
            if (age > 30 || age < 17) {
                f.get('dob').setErrors({ 'gen': true });
            }
        }
        else if (scst.includes(category)) {
            if (age > 35 || age < 17) {
                f.get('dob').setErrors({ 'scst': true });
            }
        }
        else {
            if (age > 33 || age < 17) {
                f.get('dob').setErrors({ 'obc': true });
            }
        }

        return null;
    }

    updatedForm() {
        this.basicDetailsForm = this.fb.group({
            name: [this.draftForm.name, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]*$/)
            ]],
            fatherName: [this.draftForm.fatherName, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]*$/)
            ]],
            motherName: [this.draftForm.motherName, [
                Validators.required,
                Validators.pattern(/^[a-zA-Z ]*$/)
            ]],
            dob: [this.draftForm.dob, [Validators.required]],
            age: ['', [Validators.required]],
            category: [this.draftForm.category, [Validators.required]],
            aadhar: [this.draftForm.aadhar, [Validators.required]],
            mobile: [this.draftForm.mobile, [Validators.required]],
            alternateMobile: [''],
            identificationMarks: [this.draftForm.identificationMarks],
            address1: [this.draftForm.address1, [Validators.required]],
            address2: [this.draftForm.address2, [Validators.required]],
            stateofDomicile: [this.draftForm.stateofDomicile, [Validators.required]],
            pincode: [this.draftForm.pincode, [
                Validators.required,
                Validators.pattern(/^[11][0-9]{5}$/i)
            ]],
            email: [this.draftForm.email, [Validators.required, Validators.email]]
        });
    }
}
