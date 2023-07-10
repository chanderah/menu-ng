import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/demo/service/product.service';
import { Product } from './../../api/product';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription!: Subscription;

  params!: object;
  products!: Product[];
  display: boolean = false;
  preview!: string;

  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.route.queryParams.subscribe(({ menu }) => (this.params = menu || 'root'));
  }

  ngOnInit() {
    this.productService.getProducts().then((res) => {
      this.products = res;
    });
  }

  onClickImage(data: any) {
    this.display = true;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
