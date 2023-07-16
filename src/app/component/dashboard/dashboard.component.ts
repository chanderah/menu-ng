import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/api/product';
import { ProductService } from 'src/app/service/product.service';
import { ImageDialogComponent } from './../dialog/image-dialog/image-dialog.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../../node_modules/keen-slider/keen-slider.min.css']
})
export class DashboardComponent implements OnInit {
  // @ViewChild('imageDialog') imageDialog!: ElementRef;
  // @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('sliderRef') sliderRef!: ElementRef;

  subscription!: Subscription;
  params!: object | string;

  products!: Product[];

  images!: any[];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    stagePadding: 50,
    autoplaySpeed: 1000,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    autoplayMouseleaveTimeout: 1500,
    navSpeed: 500,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: { items: 2 },
      768: { items: 4 }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialogService: DialogService,
    private ref: ChangeDetectorRef // private deviceService: DeviceDetectorService
  ) {
    this.route.queryParams.subscribe(({ menu }) => (this.params = menu || 'root'));
  }

  async ngOnInit() {
    await this.productService.getProducts().then((res) => {
      this.products = res.slice(0, 6);
    });

    let result: any[] = [];
    this.products.forEach((data) => {
      result.push({ path: `assets/images/product/${data.image}` });
    });
    this.images = result;
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
