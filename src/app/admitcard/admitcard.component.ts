import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { StudentService } from '../_services';
import { saveAs } from 'file-saver';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../_helpers/dateformat';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-admitcard',
  templateUrl: './admitcard.component.html',
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class AdmitCardComponent implements OnInit {
  focus;
  loading;
  admitCardForm: FormGroup;
  submitted = false;
  minDate = { year: 1980, month: 1, day: 1 };
  maxDate= {year:new Date().getFullYear(),month: 12, day: 31};
  currentYear = new Date().getFullYear();
  isAdmitDownloadAllowed = false;

  constructor(
    private fb: FormBuilder,
    private studentService$: StudentService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.admitCardForm = this.fb.group({
      aadhar: ['', [
        Validators.required
      ]],
      dob: ['', [Validators.required, this.validateDOB]]
    });

    const currentTime = new Date().getTime();
    if(currentTime > 1660415399000 && currentTime < 1661020199000) {
      this.isAdmitDownloadAllowed = true;
    }

    this.route.queryParamMap.subscribe(path => {
      const tabParam = path.get('tab');
      if (tabParam === "admin") {
        this.isAdmitDownloadAllowed = true;
      }
    });
  }

  validateDOB(control: AbstractControl) {
    const year = new Date().getFullYear() - 12;
    if (control.value.year > year) {
      return { age: true };
    }
    return null;
  }

  // convenience getter for easy access to form fields
  get form() { return this.admitCardForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.admitCardForm.invalid) {
      return;
    }

    const admitcardFile = await this.studentService$.getAdmitCard(this.admitCardForm.value);
    saveAs(admitcardFile, `${this.admitCardForm.value.aadhar}.pdf`);
  }
}
