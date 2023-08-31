import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { debounceTime, Subscription } from 'rxjs';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { isEmpty } from 'src/app/lib/object';
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
import { SharedService } from './../../service/shared.service';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/user.styles.scss']
})
export class DashboardComponent implements OnInit {
    env = environment;
    init: boolean = true;
    subscription!: Subscription;

    param: string;

    pagingInfo = {} as PagingInfo;
    isLoading: boolean = true;

    categories = [] as any[];
    products = [] as Product[];
    featuredProducts = [] as Product[];

    swiperOptions!: SwiperOptions;

    selectedProduct!: Product;
    showOrderFormDialog: boolean = false;

    filter: FormGroup = this.formBuilder.group({
        value: ['']
    });

    constructor(
        public appMain: AppMainComponent,
        public sharedService: SharedService,
        private route: ActivatedRoute,
        private productService: ProductService,
        private dialogService: DialogService,
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) {
        this.route.queryParams.subscribe(async ({ menu }) => {
            this.param = menu || 'root';

            if (this.param === 'root') this.initSwiper();
            else this.featuredProducts.length = 0;

            if (!this.init) {
                this.filter.reset();
                this.getProducts();
            }
        });
        //prettier-ignore
        this.filter.get('value').valueChanges.pipe(debounceTime(500)).subscribe((v: string) => {
            this.getProducts({
                filters: {
                    global: {
                        value: isEmpty(v) ? "" : v.trim()
                    }
                }
            });
        })
    }

    ngOnInit() {
        this.init = false;
        // this.getProducts();
    }

    getFeaturedProducts() {
        this.apiService.getFeaturedProducts().subscribe((res: any) => {
            if (res.status === 200) {
                this.featuredProducts = res.data;
            }
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

    getProducts(e?: LazyLoadEvent) {
        const bla = 'asdas dasdasdsa';
        console.log(bla.slice(1));
        this.isLoading = true;
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: e?.sortField || 'NAME',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
        };
        if (this.param === 'root') return this.getActiveProducts();
        else return this.getActiveProductsByCategoryParam();
    }

    getActiveProducts() {
        this.apiService.getActiveProducts(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.products = res.data;
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else alert(res.message);
        });
    }

    getActiveProductsByCategoryParam() {
        this.pagingInfo.field = { column: null, value: this.param };
        this.apiService.findActiveProductByCategoryParam(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.products = res.data;
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else alert(res.message);
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
                        value: 'pake ini',
                        price: 200000
                    },
                    {
                        value: 'pake itu',
                        price: 300000
                    },
                    {
                        value: 'pake ini pake itu',
                        price: 500000
                    }
                ]
            }
        ];
        this.selectedProduct = data;
        this.showOrderFormDialog = true;
    }

    initSwiper() {
        this.getFeaturedProducts(); //await ??
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

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }
}
