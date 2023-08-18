import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
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
import { ProductService } from '../../service/productservice';
import { ProductDialogComponent } from '../dialog/product-dialog/product-dialog.component';
import { environment } from './../../../environments/environment';
import { PagingInfo } from './../../interface/paging_info';
import { ApiService } from './../../service/api.service';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/user.styles.scss']
})
export class DashboardComponent implements OnInit {
    subscription!: Subscription;
    env = environment;
    params!: object | string;
    pagingInfo = {} as PagingInfo;

    categories = [] as any[];
    products = [] as Product[];
    featuredProducts = [] as Product[];

    swiperOptions!: SwiperOptions;

    showOrderFormDialog: boolean = false;
    selectedProduct!: Product;

    constructor(
        public appMain: AppMainComponent,
        private route: ActivatedRoute,
        private productService: ProductService,
        private dialogService: DialogService,
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) {
        this.route.queryParams.subscribe(({ menu }) => {
            this.params = menu || 'root';
            if (this.params === 'root') this.initSwiper();
            else this.removeSwiper();
        });
    }

    ngOnInit() {
        // this.getCategories();
        // this.getProducts();

        this.pagingInfo = {
            filter: '',
            limit: 10,
            offset: 0,
            sortField: 'ID',
            sortOrder: 'ASC'
        };
        this.apiService.getProducts(this.pagingInfo).subscribe((res: any) => {
            if (res.status === 200) {
                this.products = res.data;
            } else alert(res.message);
        });
    }

    getCategories() {
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
    }

    getProducts() {
        this.productService.getProducts().then((res) => {
            this.products = res;
        });
    }

    onShowOrderFormDialogChange(bool: boolean) {
        this.showOrderFormDialog = bool;
    }

    onAddToCart(data: Product) {
        //dummy
        data.options = [
            {
                name: 'Sugar',
                multiple: true,
                required: true,
                values: [
                    {
                        name: 'pake ini',
                        price: 200000
                    },
                    {
                        name: 'pake itu',
                        price: 300000
                    },
                    {
                        name: 'pake ini pake itu',
                        price: 500000
                    }
                ]
            }
        ];
        this.selectedProduct = data;
        this.showOrderFormDialog = true;
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
            .open(ProductDialogComponent, {
                header: data.name,
                data: data,
                closeOnEscape: true,
                dismissableMask: true
                // maximizable: true
            })
            .onClose.subscribe((res) => {
                if (res) this.onAddToCart(data);
            });
    }
}
