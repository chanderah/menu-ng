import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { OrderReceipt, PaymentMethod } from './../../../interface/order';
import { PagingInfo } from './../../../interface/paging_info';
import { User } from './../../../interface/user';
import { ApiService } from './../../../service/api.service';
import { OrderService } from './../../../service/order.service';
import { SharedService } from './../../../service/shared.service';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SharedUtil from 'src/app/lib/shared.util';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  dialogBreakpoints = { '768px': '90vw' };

  user = {} as User;
  pagingInfo = {} as PagingInfo;

  showOrderDetailsDialog: boolean = false;
  showPrintReceiptDialog: boolean = false;

  orders = [] as Order[];
  selectedOrder = {} as Order;
  selectedOrderReceipt = {} as OrderReceipt;

  taxesRatio: number = 0.1; //sharedService
  selectedOrderGrandTotal: number = 0;

  lastUpdated: Date = new Date();

  paymentMethods = [] as PaymentMethod[];
  form: FormGroup = this.formBuilder.group({
    paymentMethod: ['', Validators.required],
    receivedAmount: [null, Validators.required],
  });

  constructor(
    private router: Router,
    private apiService: ApiService,
    private sharedService: SharedService,
    private orderService: OrderService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.jsonParse(localStorage.getItem('user')) as User;
    this.apiService.getPaymentMethods().subscribe((res) => {
      if (res.status === 200) this.paymentMethods = res.data;
    });
  }

  getOrders(e?: LazyLoadEvent) {
    this.isLoading = true;
    this.pagingInfo = {
      filter: e?.filters?.global?.value || '',
      limit: e?.rows || 10,
      offset: e?.first || 0,
      sortField: e?.sortField || 'id',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'DESC',
    };

    this.apiService.getOrders(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.lastUpdated = new Date();
        this.pagingInfo.rowCount = res.rowCount;
        this.orders = res.data.map((v: Order) => {
          return {
            ...v,
            productsName: v.products.map((v) => v.name).join(', '),
          };
        });
      } else this.sharedService.errorToast('Failed to get Orders data.');
    });
  }

  viewOrder(data: Order) {
    if (!data) return;
    data.products.forEach((product) => {
      product.options.forEach((option) => {
        let optionsName = [];
        option.values.forEach((value) => {
          optionsName.push(value.value);
        });
        option.optionsName = optionsName.length === 1 ? optionsName[0] : optionsName.join(', ');
      });
    });

    this.selectedOrder = data;
    this.showOrderDetailsDialog = true;
  }

  onClickReceipt() {
    this.selectedOrderGrandTotal = this.selectedOrder.totalPrice + this.selectedOrder.totalPrice * this.taxesRatio;

    // this.form.get('receivedAmount').setValue(this.selectedOrderGrandTotal);
    this.form.get('paymentMethod').setValue(this.paymentMethods[0]);
    this.form.get('paymentMethod').valueChanges.subscribe((v: PaymentMethod) => {
      if (v?.id !== 1) {
        this.form.get('receivedAmount').setValue(this.selectedOrderGrandTotal);
        this.form.get('receivedAmount').disable();
      } else this.form.get('receivedAmount').enable();
    });
    this.showPrintReceiptDialog = true;
  }

  async onPrintReceipt() {
    if ((this.form.get('paymentMethod').value as PaymentMethod).id === 1) {
      if (this.form.get('receivedAmount').value < this.selectedOrderGrandTotal) {
        return this.sharedService.errorToast("Received amount can't be lower than Grand Total Price.");
      }
    }
    this.isLoading = true;

    this.form.enable();
    // this.orderService
    //   .generateOrderReceipt({
    //     tableId: this.selectedOrder.tableId,
    //     orderCode: this.selectedOrder.orderCode,
    //     receivedAmount: this.form.get('receivedAmount').value,
    //     paymentMethod: this.form.get('paymentMethod').value,
    //     taxes: this.selectedOrder.totalPrice * 0.1, // sharedService
    //     subTotal: this.selectedOrder.totalPrice,
    //     total: this.selectedOrderGrandTotal,
    //     products: this.selectedOrder.products,
    //     issuedAt: this.selectedOrder.createdAt,
    //     createdAt: new Date(),
    //   })
    //   .then((res) => {
    //     this.selectedOrderReceipt = res;
    //     setTimeout(() => this.printAsPdf(), 10);
    //   });
  }

  printAsPdf() {
    try {
      const content = document.getElementById('pdfContent');
      html2canvas(content).then((canvas) => {
        const imgWidth = 88;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let pdf = new jsPDF({
          orientation: 'portrait',
          compress: false,
          format: [imgWidth + 2, imgHeight + 2],
        });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 1, 1, imgWidth, imgHeight);
        // pdf.save(`invoices-${new Date().getTime()}.pdf`);
        // pdf.autoPrint();
        // window.open(pdf.output('bloburl'));
        // pdf.output('dataurlnewwindow');
        // this.showOrderDetailsDialog = false;
        // this.showPrintReceiptDialog = false;
        // this.sharedService.showNotification('Receipt is successfully downloaded!');

        pdf.autoPrint();

        const frame = document.createElement('iframe');
        frame.style.position = 'fixed';
        frame.style.width = '1px';
        frame.style.height = '1px';
        frame.style.opacity = '0.01';
        const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
        if (isSafari) {
          // fallback in safari
          frame.onload = () => {
            try {
              frame.contentWindow.document.execCommand('print', false, null);
            } catch (e) {
              frame.contentWindow.print();
            }
          };
        }
        frame.src = pdf.output('bloburl').toString();
        document.body.appendChild(frame);
      });
    } catch (err) {
      this.sharedService.showErrorNotification();
    } finally {
      this.isLoading = false;
    }
  }

  getRowStyle(data: boolean) {
    return {
      background: data ? '#c8e6c9' : '#ffcdd2',
      color: data ? '#256029' : '#c63737',
      // width: this.app.isDesktop() ? '50vw' : '100vw',
      // height: 'auto',
      // left: this.app.isDesktop() ? '25vw' : 0,
      // overflow: 'scroll'
    };
  }

  onStart() {}

  onPause() {}
}
