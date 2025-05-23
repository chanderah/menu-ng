import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  // styleUrls: ['../../../../assets/styles/user.styles.scss'],
})
export class OrderCompleteComponent implements OnInit, AfterViewInit {
  timeout: number = 10;
  totalPrice!: number;

  constructor() {
    // this.totalPrice = router.getCurrentNavigation().extras.state?.totalPrice ?? 0;
  }

  ngOnInit(): void {
    // if (this.totalPrice === 0) this.router.navigate(['/']);
    // else this.orderService.finishOrder(this.totalPrice);
  }

  ngAfterViewInit(): void {
    this.countdown(this.timeout);
  }

  countdown(num: number) {
    if (num === 0) window.location.replace('/');
    else {
      this.timeout = num;
      setTimeout(() => {
        this.countdown(num - 1);
      }, 1000);
    }
  }
}
