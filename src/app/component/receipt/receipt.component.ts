import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
    currentDate: Date = new Date();
    orders: any[] = [];
    taxesRatio: number = 0.1; //10%
    taxes: number = 0;
    subTotal: number = 0;
    total: number = 0;
    receivedAmount: number = 200000;
    changes: number = 0;

    constructor() {}

    ngOnInit(): void {
        for (let i = 0; i < 10; i++) {
            this.orders.push({
                name: `Products ${i + 1}`,
                qty: i + 1,
                price: 2890 * (i + 1) + i
            });
        }
        this.countTotal();
    }

    countTotal() {
        for (const order of this.orders) {
            this.subTotal += order.price;
        }
        this.taxes = this.subTotal * this.taxesRatio;
        this.total = this.subTotal + this.taxes;
        this.changes = this.receivedAmount - this.total;
    }

    convertToPdf() {
        const content = document.getElementById('pdfContent');
        html2canvas(content).then((canvas) => {
            const imgWidth = 48;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let pdf = new jsPDF('p', 'mm', 'A8', false);
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 2, 2, imgWidth, imgHeight);
            pdf.save(`invoices-${new Date().getTime()}.pdf`);
        });
    }

    onPrint() {}
}
