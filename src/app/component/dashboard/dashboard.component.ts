import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    Swiper,
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
export class DashboardComponent implements OnInit, AfterViewInit {
    subscription!: Subscription;
    params!: object | string;

    featuredProducts = [] as Product[];
    swiperOptions!: SwiperOptions;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private dialogService: DialogService
    ) {
        this.route.queryParams.subscribe(({ menu }) => (this.params = menu || 'root'));
    }

    ngAfterViewInit(): void {
        new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            autoplay: {
                delay: 3000
            },
            spaceBetween: 30
        });
    }

    ngOnInit() {
        if (this.params === 'root') {
            this.productService.getProducts().then((res) => (this.featuredProducts = res.slice(0, 6)));
            this.swiperOptions = {
                autoHeight: true,
                autoplay: {
                    delay: 2500,
                    pauseOnMouseEnter: true
                },
                loop: true,
                centeredSlides: true,
                navigation: {
                    nextEl: '.swiper-button-next1',
                    prevEl: '.swiper-button-prev1'
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1
                    },
                    768: {
                        slidesPerView: 4
                    }
                }

                // scrollbar: { draggable: true }
            };
        }
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
