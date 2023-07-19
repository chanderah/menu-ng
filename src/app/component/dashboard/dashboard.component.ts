import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { ImageDialogComponent } from './../dialog/image-dialog/image-dialog.component';

// import Swiper core and required components
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
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

    ngAfterViewInit(): void {}

    ngOnInit() {
        if (this.params === 'root') {
            this.productService.getProducts().then((res) => (this.featuredProducts = res.slice(0, 6)));
            this.swiperOptions = {
                autoHeight: true,
                autoplay: {
                    delay: 3000
                    // pauseOnMouseEnter: true
                },
                loop: true,
                slidesPerView: 2,
                centeredSlides: true,
                navigation: {
                    nextEl: '.swiper-button-next1',
                    prevEl: '.swiper-button-prev1'
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
