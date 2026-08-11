import { Component, OnInit, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayService } from './../../../_services';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-declarationpayment',
    templateUrl: './declarationpayment.component.html'
})

export class DeclarationPaymentComponent implements OnInit {
    @Input() draftForm: any;
    declarationForm: FormGroup;
    focus;
    pay;
    submitted = false;
    @Output() formResponse = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private payService$: PayService,
        @Inject(PLATFORM_ID) private platformId: any) { }

    ngOnInit() {
        this.declarationForm = this.fb.group({
            declaration: ['', [Validators.required]],
            preview: [this.draftForm, [Validators.required]]
        });
    }

    // convenience getter for easy access to form fields
    get form() { return this.declarationForm.controls; }

    async onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.declarationForm.invalid) {
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            this.payService$.pay(this.declarationForm.value.preview).subscribe(
                data => {
                    this.pay = data;
                    window.location.href = this.pay.url;
                });
        }
    }
}
