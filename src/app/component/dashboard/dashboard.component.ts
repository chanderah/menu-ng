import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/service/cart.service';
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

    // demo
    sortOptions: SelectItem[];
    sortOrder: number;
    sortField: string;
    sourceCities: any[];
    targetCities: any[];
    orderCities: any[];

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private dialogService: DialogService,
        private cartService: CartService,
        private messageService: MessageService
    ) {
        this.route.queryParams.subscribe(({ menu }) => {
            this.params = menu || 'root';
            if (this.params === 'root') this.initSwiper();
            else this.removeSwiper();
        });
    }

    ngOnInit() {
        this.getProducts();

        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }
        ];
        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' }
        ];

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
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

    addToCart(data: Product) {
        // this.cartService.addToCart(data);
        this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success!',
            detail: 'The product is successfully added to cart.'
        });
    }
}
