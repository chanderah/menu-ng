import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/api/product';
import { ProductService } from 'src/app/service/product.service';
import { ImageDialogComponent } from './../dialog/image-dialog/image-dialog.component';

@Component({
  templateUrl: './dashboard.component.html'
  // styleUrls: ['../../../../node_modules/keen-slider/keen-slider.min.css']
})
export class DashboardComponent implements OnInit {
  subscription!: Subscription;
  params!: object | string;

  owlOptions!: OwlOptions;
  featuredProducts = [] as Product[];
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
    private productService: ProductService,
    private dialogService: DialogService,
    private ref: ChangeDetectorRef // private deviceService: DeviceDetectorService
  ) {
    this.route.queryParams.subscribe(({ menu }) => (this.params = menu || 'root'));
  }

  ngOnInit() {
    if (this.params === 'root') {
      this.owlOptions = {
        loop: true,
        autoplay: true,
        center: true,
        dots: false,
        stagePadding: 20,
        autoplaySpeed: 1000,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        autoplayMouseleaveTimeout: 1500,
        margin: 0,
        nav: true,
        navText: [
          '<i class="pi pi-angle-left" aria-hidden="true"></i>',
          '<i class="pi pi-angle-right" aria-hidden="true"></i>'
        ],
        navSpeed: 500,
        autoHeight: true,
        autoWidth: true,
        responsive: {
          0: { items: 2 },
          768: { items: 4 }
        }
      };
      this.productService.getProducts().then((res) => (this.featuredProducts = res.slice(0, 6)));
    }
  }

  getData(e: any) {
    console.log(e);
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
}
