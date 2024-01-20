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
    taxesRatio: number = 0.1; //10%
    // tableId: number = 7;
    // orders: any[] = [];
    // taxes: number = 0;
    // subTotal: number = 0;
    // total: number = 0;
    // receivedAmount: number = 200000;
    // changes: number = 0;

    constructor(private router: Router) {}

    ngOnInit(): void {
        // const products: Product[] = [];
        // for (let i = 0; i < 3; i++) {
        //     products.push({
        //         name: `Products ${i + 1}`,
        //         quantity: i + 1,
        //         price: 2890 * (i + 1) + i
        //     });
        // }

        // this.orderReceipt = {
        //     ...this.orderReceipt,
        //     orderCode: '6A85708B',
        //     receivedAmount: 200000,
        //     issuedAt: new Date(),
        //     createdAt: new Date(),
        //     tableId: 7,
        //     products: products
        // };
        const props = this.router.getCurrentNavigation().extras.state;
        console.log(props);
        // this.countTotal();
    }

    countTotal() {
        this.orderReceipt.subTotal = 0;
        for (const product of this.orderReceipt.products) {
            this.orderReceipt.subTotal += product.price * product.quantity;
        }
        this.orderReceipt.taxes = this.orderReceipt.subTotal * this.taxesRatio;
        this.orderReceipt.total = this.orderReceipt.subTotal + this.orderReceipt.taxes;
        this.orderReceipt.changes = this.orderReceipt.receivedAmount - this.orderReceipt.total;
    }

    convertToPdf() {
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
