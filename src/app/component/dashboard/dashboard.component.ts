import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // @ViewChild('imageDialog') imageDialog!: ElementRef;
  // @ViewChild('carousel') carousel!: ElementRef;
  subscription!: Subscription;

  params!: object;
  showFeatured: boolean = false;

  products!: Product[];
  preview!: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialogService: DialogService,
    private ref: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(({ menu }) => {
      this.params = menu || 'root';
      if (!menu) this.showFeatured = true;
      else this.showFeatured = false;
    });
  }

  async ngOnInit() {
    await this.productService.getProducts().then((res) => {
      this.products = res.slice(0, 6);
    });
    console.log(this.products);
    // console.log(this.caaaa.isNextArrowDisabled());
    // setTimeout(() => {
    //   console.log(this.caaaa.isNextArrowDisabled());
    // }, 12000);
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
