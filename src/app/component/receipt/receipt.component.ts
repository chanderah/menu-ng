import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { OrderReceipt } from './../../interface/order';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
    orderReceipt = {} as OrderReceipt;
    // tableId: number = 7;
    // orders: any[] = [];
    // taxes: number = 0;
    // subTotal: number = 0;
    // total: number = 0;
    // receivedAmount: number = 200000;
    // changes: number = 0;

    constructor(private router: Router) {
        // this.orderReceipt = this.router.getCurrentNavigation()?.extras?.state?.orderReceipt ?? {};
    }

    ngOnInit(): void {
        this.convertToPdf();
    }

    // @Input
    // set data() {

    // }

    convertToPdf() {
        // this.orderReceipt.subTotal = 0;
        // for (const product of this.orderReceipt.products) {
        //     this.orderReceipt.subTotal += product.price * product.quantity;
        // }
        // this.orderReceipt.taxes = this.orderReceipt.subTotal * this.sharedService.getShopConfig().taxes;
        // this.orderReceipt.taxes = this.orderReceipt.subTotal * 0.1;
        this.orderReceipt.total = this.orderReceipt.subTotal + this.orderReceipt.taxes;
        this.orderReceipt.changes = this.orderReceipt.receivedAmount - this.orderReceipt.total;

        const content = document.getElementById('pdfContent');
        html2canvas(content).then((canvas) => {
            const imgWidth = 88;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            console.log('imgWidth', imgWidth);
            console.log('imgHeight', imgHeight);

            let pdf = new jsPDF({
                orientation: 'portrait',
                compress: false,
                format: [imgWidth + 2, imgHeight + 2]
            });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 1, 1, imgWidth, imgHeight);
            pdf.save(`invoices-${new Date().getTime()}.pdf`);
        });
    }

    onPrint() {}
}
