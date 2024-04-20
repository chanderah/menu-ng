import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, debounceTime, take } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Category } from 'src/app/interface/category';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
import { enableBodyScroll } from 'src/app/lib/utils';
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
import { SharedService } from '../../service/shared.service';
import { PagingInfo } from './../../interface/paging_info';
import { ApiService } from './../../service/api.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/user.styles.scss']
})
export class DashboardComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    init: boolean = true;
    subscription!: Subscription;

    currentMenu: string;
    selectedCategory: Category;
    categories!: Category[];

    pagingInfo = {} as PagingInfo;

    products = [] as Product[];
    featuredProducts = [] as Product[];

    swiperOptions!: SwiperOptions;

    selectedProduct!: Product;
    showOrderDialog: boolean = false;

    filter: FormGroup = this.formBuilder.group({
        value: ['']
    });

    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent,
        private sharedService: SharedService,
        private route: ActivatedRoute,
        private router: Router,
        private dialogService: DialogService,
        // private orderService: OrderService,
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) {
        super();

        this.route.queryParams.subscribe((params) => {
            this.currentMenu = params?.menu;
            if (!this.currentMenu) this.initSwiper();
            if (!this.init) this.getProducts();
        });

        this.filter
            .get('value')
            .valueChanges.pipe(debounceTime(500))
            .subscribe(() => this.getProducts());
    }

    ngOnInit() {
        this.init = false;
    }

    async getProducts(e?: LazyLoadEvent) {
        this.isLoading = true;
        this.pagingInfo = {
            filter: this.filter.get('value').value,
            condition: [
                {
                    column: 'status',
                    value: true
                }
            ],
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: e?.sortField || 'NAME',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
        };

        if (this.currentMenu) {
            await this.getCategories().then(() => {
                this.selectedCategory = this.categories.find((v) => v.param === this.currentMenu);
                if (!this.selectedCategory) this.router.navigateByUrl('/');
                else this.pagingInfo.condition.push({ column: 'category_id', value: this.selectedCategory.id });
            });
        }

        this.apiService.getProducts(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.products = res.data;
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else this.sharedService.errorToast(res.message);
        });
    }

    async getCategories() {
        return new Promise((resolve) => {
            if (this.categories) {
                resolve(true);
            } else {
                this.app.categories.pipe(take(2)).subscribe((res) => {
                    if (res) {
                        this.categories = res;
                        resolve(true);
                    }
                });
            }
        });
    }

    onShowOrderDialogChange(bool: boolean) {
        if (bool === false) enableBodyScroll();
        this.showOrderDialog = bool;
    }

    onAddToCart(data: Product) {
        this.selectedProduct = data;
        this.showOrderDialog = true;
    }

    initSwiper() {
        if (!this.swiperOptions) {
            this.apiService
                .getProducts({ limit: 10, condition: [{ column: 'featured', value: true }] })
                .subscribe((res: any) => {
                    if (res.status === 200) {
                        this.featuredProducts = res.data;
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
                });
        }
    }

    onClickImage(data: any) {
        this.dialogService
            .open(ProductDialogComponent, {
                header: data.name,
                data: data,
                closeOnEscape: true,
                dismissableMask: true,
                height: 'auto'
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
