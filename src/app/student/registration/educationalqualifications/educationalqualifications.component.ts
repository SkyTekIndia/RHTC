import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-educationalqualifications',
    templateUrl: './educationalqualifications.component.html'
})

export class EducationalQualificationsComponent implements OnInit {
    focus;
    @Input() draftForm: any;
    educationalqualificationsForm: FormGroup;
    submitted = false;
    passingYears = [];
    @Output() formResponse = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
        let yearCount = 0;
        this.passingYears.push('');
        while (yearCount <= 40) {
            this.passingYears.push(new Date().getFullYear() - yearCount);
            yearCount++;
        }
    }

    ngOnInit() {
        if (this.draftForm) {
            this.updatedForm();
        } else {
            this.newForm();
        }
    }

    // convenience getter for easy access to form fields
    get tenth(): any { return this.educationalqualificationsForm.get('tenth'); }
    get twelfth(): any { return this.educationalqualificationsForm.get('twelfth'); }

    onSubmit() {
        this.submitted = true;

        const tenthMarksObtained = this.educationalqualificationsForm.get('tenth').get('marksObtained').value;
        const tenthMaximumMarks = this.educationalqualificationsForm.get('tenth').get('maximumMarks').value;
        const tenthPassingYear = this.educationalqualificationsForm.get('tenth').get('passingYear').value;
        const tenthPercentage = this.educationalqualificationsForm.get('tenth').get('percentageMarks').value;

        const twelfthMarksObtained = this.educationalqualificationsForm.get('twelfth').get('marksObtained').value;
        const twelfthMaximumMarks = this.educationalqualificationsForm.get('twelfth').get('maximumMarks').value;
        const twelfthPassingYear = this.educationalqualificationsForm.get('twelfth').get('passingYear').value;
        const twelfthPercentage = this.educationalqualificationsForm.get('twelfth').get('percentageMarks').value;

        if (tenthMarksObtained > tenthMaximumMarks) {
            this.educationalqualificationsForm.get('tenth').get('marksObtained').setErrors({ 'invalidMarks': true });
        }

        if (twelfthMarksObtained > twelfthMaximumMarks) {
            this.educationalqualificationsForm.get('twelfth').get('marksObtained').setErrors({ 'invalidMarks': true });
        }

        if (tenthPassingYear >= twelfthPassingYear) {
            this.educationalqualificationsForm.get('twelfth').get('passingYear').setErrors({ 'invalidYear': true });
        }

        if (!(tenthPercentage > 32 && tenthPercentage < 100)) {
            this.educationalqualificationsForm.get('tenth').get('percentageMarks').setErrors({ 'invalidPercentage': true });
        }

        if (!(twelfthPercentage > 32 && twelfthPercentage < 100)) {
            if(twelfthPercentage !== 'NA') {
                this.educationalqualificationsForm.get('twelfth').get('percentageMarks').setErrors({ 'invalidPercentage': true });
            }
        }

        // stop here if form is invalid
        if (this.educationalqualificationsForm.invalid) {
            return;
        }

        let response = {
            educationalqualifications: this.educationalqualificationsForm.value
        }
        this.formResponse.emit(response);
    }

    updatedForm() {
        this.educationalqualificationsForm = this.fb.group({
            tenth: this.fb.group({
                board: [this.draftForm.tenth.board, [Validators.required, Validators.minLength(3)]],
                passingYear: [this.draftForm.tenth.passingYear, [Validators.required]],
                marksObtained: [this.draftForm.tenth.marksObtained, [Validators.required]],
                maximumMarks: [this.draftForm.tenth.maximumMarks, [Validators.required]],
                percentageMarks: [this.draftForm.tenth.percentageMarks, [Validators.required, Validators.min(33), Validators.max(99)]],
                schoolNameAndLocation: [this.draftForm.tenth.schoolNameAndLocation, [Validators.required]],
            }),
            twelfth: this.fb.group({
                status: [this.draftForm.twelfth.status, [Validators.required]],
                board: [this.draftForm.twelfth.board, [Validators.required]],
                passingYear: [this.draftForm.twelfth.passingYear, [Validators.required]],
                marksObtained: [this.draftForm.twelfth.marksObtained, [
                    Validators.required,
                    Validators.pattern(/NA|na|^\d{3}$/gm)
                ]],
                maximumMarks: [this.draftForm.twelfth.maximumMarks, [
                    Validators.required,
                    Validators.pattern(/NA|na|^\d{3}$/gm)
                ]],
                percentageMarks: [this.draftForm.twelfth.percentageMarks, [
                    Validators.required,
                    Validators.pattern(/NA|na|^\d{2}$/gm)
                ]],
                schoolNameAndLocation: [this.draftForm.twelfth.schoolNameAndLocation, [Validators.required]],
            })
        });
    }

    calculatePercent(type) {
        if (type == 'tenth') {
            const marksObtained = this.educationalqualificationsForm.get('tenth').get('marksObtained').value;
            const maximumMarks = this.educationalqualificationsForm.get('tenth').get('maximumMarks').value;
            if (marksObtained && maximumMarks) {
                const percent = (marksObtained * 100) / maximumMarks;
                this.educationalqualificationsForm.get('tenth').get('percentageMarks').setValue(percent.toFixed(2));
            }
        }

        if (type == 'twelfth') {
            const marksObtained = this.educationalqualificationsForm.get('twelfth').get('marksObtained').value;
            const maximumMarks = this.educationalqualificationsForm.get('twelfth').get('maximumMarks').value;
            if (marksObtained && maximumMarks && marksObtained !== 'NA' && maximumMarks !== 'NA') {
                const percent = (marksObtained * 100) / maximumMarks;
                this.educationalqualificationsForm.get('twelfth').get('percentageMarks').setValue(percent.toFixed(2));
            }
        }
    }

    newForm() {
        this.educationalqualificationsForm = this.fb.group({
            tenth: this.fb.group({
                board: ['', [Validators.required]],
                passingYear: ['', [Validators.required]],
                marksObtained: ['', [Validators.required]],
                maximumMarks: ['', [Validators.required]],
                percentageMarks: ['', [Validators.required]],
                schoolNameAndLocation: ['', [Validators.required]],
            }),
            twelfth: this.fb.group({
                status: ['', [Validators.required]],
                board: ['', [Validators.required]],
                passingYear: ['', [Validators.required]],
                marksObtained: ['', [
                    Validators.required,
                    Validators.pattern(/NA|na|^\d{3}$/gm)
                ]],
                maximumMarks: ['', [
                    Validators.required,
                    Validators.pattern(/NA|na|^\d{3}$/gm)
                ]],
                percentageMarks: ['', [
                    Validators.required,
                    Validators.pattern(/NA|na|^\d{2}.\d{1,2}$/gm)
                ]],
                schoolNameAndLocation: ['', [Validators.required]],
            })
        });
    }
}
