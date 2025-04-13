import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order, PaymentMethod, PaymentType } from 'src/app/interface/order';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from 'src/app/service/api.service';
import { ChoosePaymentDialogComponent } from '../choose-payment-dialog/choose-payment-dialog.component';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss'],
})
export class OrderDetailsDialogComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  showPaymentDialog: boolean = false;
  showPrintDialog: boolean = false;

  data!: Order;
  paymentMethods: PaymentMethod[] = [];
  isDataUpdated: boolean = false;

  constructor(
    private dialogService: DialogService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig<{
      order: Order;
      paymentMethods: PaymentMethod[];
    }>,
    private apiService: ApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.data = this.dialogConfig.data.order;
    this.paymentMethods = this.dialogConfig.data.paymentMethods;

    this.apiService.getOrderById(this.data.id).subscribe((res) => {
      this.isLoading = false;
      this.data = res.data;
    });
  }

  async onClickPayment() {
    const dialogRef = this.dialogService.open(ChoosePaymentDialogComponent, {
      ...this.defaultStackedDialogConfig,
      header: 'Choose Payment Method',
      data: this.paymentMethods,
    });

    dialogRef.onClose.subscribe((res: PaymentMethod) => {
      if (res) {
        this.data.paymentType = PaymentType.COUNTER;
        this.data.paymentMethod = res.label;
        // this.isDataUpdated = true;
        this.onClickReceipt();
      }
    });
  }

  onClickReceipt() {
    this.dialogConfig.closeOnEscape = false;
    this.dialogConfig.dismissableMask = false;
    this.showPrintDialog = true;
    console.log('creating receipt...');
  }

  // onClickReceipt() {
  //   // this.selectedOrderGrandTotal = this.selectedOrder.totalPrice + this.selectedOrder.totalPrice * this.taxesRatio;
  //   // // this.form.get('receivedAmount').setValue(this.selectedOrderGrandTotal);
  //   // this.form.get('paymentMethod').setValue(this.paymentMethods[0]);
  //   // this.form.get('paymentMethod').valueChanges.subscribe((v: PaymentMethod) => {
  //   //   if (v?.id !== 1) {
  //   //     this.form.get('receivedAmount').setValue(this.selectedOrderGrandTotal);
  //   //     this.form.get('receivedAmount').disable();
  //   //   } else this.form.get('receivedAmount').enable();
  //   // });
  //   this.showPrintReceiptDialog = true;
  // }

  // async onPrintReceipt() {
  //   // if ((this.form.get('paymentMethod').value as PaymentMethod).id === 1) {
  //   //   if (this.form.get('receivedAmount').value < this.selectedOrderGrandTotal) {
  //   //     return this.toastService.errorToast("Received amount can't be lower than Grand Total Price.");
  //   //   }
  //   // }
  //   // this.isLoading = true;
  //   // this.form.enable();
  //   // this.orderService
  //   //   .generateOrderReceipt({
  //   //     tableId: this.selectedOrder.tableId,
  //   //     orderCode: this.selectedOrder.orderCode,
  //   //     receivedAmount: this.form.get('receivedAmount').value,
  //   //     paymentMethod: this.form.get('paymentMethod').value,
  //   //     taxes: this.selectedOrder.totalPrice * 0.1, // sharedService
  //   //     subTotal: this.selectedOrder.totalPrice,
  //   //     total: this.selectedOrderGrandTotal,
  //   //     products: this.selectedOrder.products,
  //   //     issuedAt: this.selectedOrder.createdAt,
  //   //     createdAt: new Date(),
  //   //   })
  //   //   .then((res) => {
  //   //     this.selectedOrderReceipt = res;
  //   //     setTimeout(() => this.printAsPdf(), 10);
  //   //   });
  // }

  // printAsPdf() {
  //   try {
  //     const content = document.getElementById('pdfContent');
  //     html2canvas(content).then((canvas) => {
  //       const imgWidth = 88;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       let pdf = new jsPDF({
  //         orientation: 'portrait',
  //         compress: false,
  //         format: [imgWidth + 2, imgHeight + 2],
  //       });
  //       pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 1, 1, imgWidth, imgHeight);
  //       // pdf.save(`invoices-${new Date().getTime()}.pdf`);
  //       // pdf.autoPrint();
  //       // window.open(pdf.output('bloburl'));
  //       // pdf.output('dataurlnewwindow');
  //       // this.showOrderDetailsDialog = false;
  //       // this.showPrintReceiptDialog = false;
  //       // this.sharedService.showNotification('Receipt is successfully downloaded!');

  //       pdf.autoPrint();

  //       const frame = document.createElement('iframe');
  //       frame.style.position = 'fixed';
  //       frame.style.width = '1px';
  //       frame.style.height = '1px';
  //       frame.style.opacity = '0.01';
  //       const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  //       if (isSafari) {
  //         // fallback in safari
  //         frame.onload = () => {
  //           try {
  //             frame.contentWindow.document.execCommand('print', false, null);
  //           } catch (e) {
  //             frame.contentWindow.print();
  //           }
  //         };
  //       }
  //       frame.src = pdf.output('bloburl').toString();
  //       document.body.appendChild(frame);
  //     });
  //   } catch (err) {
  //     this.sharedService.showErrorNotification();
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  close() {
    this.dialogRef.close(this.data);
  }
}
