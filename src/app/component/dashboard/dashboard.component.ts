import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/api/product';
import { ProductService } from 'src/app/service/product.service';
import { ImageDialogComponent } from './../dialog/image-dialog/image-dialog.component';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // @ViewChild('imageDialog') imageDialog!: ElementRef;
  // @ViewChild('pDialog') pDialog!: ElementRef;

  subscription!: Subscription;
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

  params!: object;
  showFeatured: boolean = false;

  products!: Product[];
  preview!: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialogService: DialogService
  ) {
    this.route.queryParams.subscribe(({ menu }) => {
      this.params = menu || 'root';
      if (!menu) this.showFeatured = true;
      else this.showFeatured = false;
    });
  }

  ngOnInit() {
    this.productService.getProducts().then((res) => {
      this.products = res;
    });
  }

  onClickImage(data: any) {
    this.dialogService
      .open(ImageDialogComponent, {
        header: data.name,
        data: data,
        closeOnEscape: true,
        dismissableMask: true,
        maximizable: true
      })
      .onClose.subscribe((res) => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
