import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from './../../service/order.service';

@Component({
    selector: 'app-order-complete',
    templateUrl: './order-complete.component.html',
    styleUrls: ['../../../../src/assets/user.styles.scss']
})
export class OrderCompleteComponent implements OnInit, AfterViewInit {
    timeout: number = 15;

    constructor(
        private router: Router,
        private orderService: OrderService
    ) {}

    ngOnInit(): void {
        if (this.orderService.getCart().length > 0) this.router.navigate(['/']);
    }

    ngAfterViewInit(): void {
        this.countdown(this.timeout);
    }

    countdown(num: number) {
        if (num === 0) window.location.href = '/';
        else {
            this.timeout = num;
            setTimeout(() => {
                this.countdown(num - 1);
            }, 1000);
        }
    }
}
