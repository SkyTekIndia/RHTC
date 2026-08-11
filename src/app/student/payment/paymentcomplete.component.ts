import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { StudentService } from 'src/app/_services';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-paymentcomplete',
    templateUrl: './paymentcomplete.component.html'
})
export class PaymentCompleteComponent implements OnInit {

    message: any;
    txnID: string;

    constructor(
        @Inject(PLATFORM_ID) private platform: any,
        private studentService$: StudentService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            this.route.queryParams.subscribe(params => {
                console.log("onCompletePayment",params);
                if (params.txnid && params.response) {
                    this.txnID = params.txnid;
                    this.message = JSON.parse(atob(params.response));                   
                } 
            });
        }
    }

    async printApplication() {
        const applicationFile = await this.studentService$.applicationForm({ txnID: this.txnID });
        const pdfName = this.txnID;
        saveAs(applicationFile, `${pdfName}.pdf`);
    }
}
