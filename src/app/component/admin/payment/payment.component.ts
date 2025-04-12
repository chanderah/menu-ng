import { Component, OnInit } from '@angular/core';
import { PaymentMethod } from 'src/app/interface/order';
import { PagingInfo } from 'src/app/interface/paging_info';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  isLoading: boolean = true;
  pagingInfo: PagingInfo = {
    page: 1,
    limit: 10,
  };
  paymentMethods: PaymentMethod[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getPaymentMethods().subscribe((res) => {
      this.isLoading = false;
      this.paymentMethods = res.data;
      this.pagingInfo.rowCount = res.rowCount;
    });
  }
}
