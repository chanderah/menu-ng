import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AppMainComponent } from 'src/app/layout/app.main.component';
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
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/user.styles.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('swiper') swiper!: ElementRef;

    subscription!: Subscription;
    params!: object | string;

    categories = [] as any[];
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
        public appMain: AppMainComponent,
        private route: ActivatedRoute,
        private productService: ProductService,
        private dialogService: DialogService,
        private cartService: CartService
    ) {
        this.route.queryParams.subscribe(({ menu }) => {
            this.params = menu || 'root';
            if (this.params === 'root') this.initSwiper();
            else this.removeSwiper();
        });
    }

    ngOnInit() {
        this.categories = [
            {
                label: 'Filter',
                icon: 'pi pi-fw pi-sliders-v',
                items: [
                    [
                        {
                            label: 'Categories',
                            items: [{ label: 'All' }, { label: 'Foods' }, { label: 'Drinks' }]
                        }
                    ]
                ]
            }
        ];

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
        this.cartService.addToCart(data);
    }
}
