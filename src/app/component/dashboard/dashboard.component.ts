import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import SwiperCore, {
    A11y,
    Autoplay,
    Controller,
    Navigation,
    Pagination,
    Scrollbar,
    SwiperOptions,
    Thumbs,
    Virtual,
    Zoom
} from 'swiper';
import { Product } from '../../interface/product';
import { ProductService } from '../../service/productservice';
import { ImageDialogComponent } from './../dialog/image-dialog/image-dialog.component';

// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @ViewChild('swiper') swiper!: ElementRef;

    subscription!: Subscription;
    params!: object | string;

    products = [] as Product[];
    featuredProducts = [] as Product[];

    swiperOptions!: SwiperOptions;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private dialogService: DialogService
    ) {
        this.route.queryParams.subscribe(({ menu }) => {
            this.params = menu || 'root';
            if (this.params === 'root') this.initSwiper();
            else this.removeSwiper();
        });
    }

    ngOnInit() {
        this.getProducts();
    }

    getProducts() {
        this.productService.getProducts().then((res) => {
            this.products = res;
        });
    }

    removeSwiper() {
        this.featuredProducts.length = 0;
    }

    initSwiper() {
        this.productService.getProducts().then((res) => (this.featuredProducts = res.slice(0, 6)));
        this.swiperOptions = {
            autoHeight: true,
            autoplay: {
                delay: 2500,
                pauseOnMouseEnter: true,
                disableOnInteraction: false
            },
            loop: true,
            centeredSlides: true,
            // navigation: {
            //     nextEl: '.swiper-button-next1',
            //     prevEl: '.swiper-button-prev1'
            // },
            breakpoints: {
                0: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 4
                }
            }
        };
    }

    onClickImage(data: any) {
        this.dialogService
            .open(ImageDialogComponent, {
                header: data.name,
                data: data,
                closeOnEscape: true,
                dismissableMask: true
                // maximizable: true
            })
            .onClose.subscribe((res) => {
                console.log(res);
            });
    }
}
