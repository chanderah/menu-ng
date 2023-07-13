import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { Carousel } from 'primeng/carousel';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/api/product';
import { ProductService } from 'src/app/service/product.service';
import { ImageDialogComponent } from './../dialog/image-dialog/image-dialog.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../../node_modules/keen-slider/keen-slider.min.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // @ViewChild('imageDialog') imageDialog!: ElementRef;
  // @ViewChild('pDialog') pDialog!: ElementRef;
  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLElement>;
  slider!: KeenSliderInstance;

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

    Carousel.prototype.onTouchMove = () => {};
    Carousel.prototype.onTouchStart = () => {
      this.disableAutoPlay();
    };
    Carousel.prototype.onTouchEnd = () => {};
  }

  async ngOnInit() {
    await this.productService.getProducts().then((res) => {
      this.products = res;
    });
  }

  enableAutoPlay() {
    Carousel.prototype.autoplayInterval = 2000;
    Carousel.prototype.allowAutoplay = true;
  }

  disableAutoPlay() {
    Carousel.prototype.allowAutoplay = false;
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

  ngAfterViewInit() {
    // this.initFeaturedProduct();
  }

  initFeaturedProduct() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, { loop: true }, [
      (slider) => {
        let timeout: any;
        let mouseOver: boolean = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }

        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
      }
    ]);
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy();
    if (this.subscription) this.subscription.unsubscribe();
  }
}
