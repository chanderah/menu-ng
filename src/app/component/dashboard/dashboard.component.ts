import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
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
import { enableBodyScroll } from './../../lib/shared.util';
import { ApiService } from './../../service/api.service';
import { OrderService } from './../../service/order.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/user.styles.scss']
})
export class DashboardComponent extends SharedUtil implements OnInit {
    init: boolean = true;
    subscription!: Subscription;

    currentMenu: string;

    pagingInfo = {} as PagingInfo;
    isLoading: boolean = true;

    categories = [] as any[];
    products = [] as Product[];
    featuredProducts = [] as Product[];

    swiperOptions!: SwiperOptions;

    selectedProduct!: Product;
    showOrderDialog: boolean = false;

    filter: FormGroup = this.formBuilder.group({
        value: ['']
    });

    constructor(
        public appMain: AppMainComponent,
        private sharedService: SharedService,
        private route: ActivatedRoute,
        private router: Router,
        private dialogService: DialogService,
        private orderService: OrderService,
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) {
        super();
        this.route.queryParams.subscribe((params: any) => {
            this.currentMenu = params.menu || 'root';
            if (this.currentMenu === 'root') this.initSwiper();
            if (!this.init) this.getProducts();
        });
        this.filter
            .get('value')
            .valueChanges.pipe(debounceTime(500))
            .subscribe(() => this.getProducts());
    }

    async ngOnInit() {
        this.init = false;
        // this.getProducts();

        // const data = await db.getAppData('user');
        // console.log(data);
        // db.app.update('user', { userId: 'chandraa01', name: 'csa' });
        // db.app.update({ id: 'user', value: 'yuhu' });

        // this.sharedService.setUser();
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
        this.isLoading = true;
        this.pagingInfo = {
            filter: this.filter.get('value').value,
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: e?.sortField || 'NAME',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
        };
        if (this.currentMenu === 'root') return this.getActiveProducts();
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
        this.pagingInfo.field = { column: null, value: this.currentMenu };
        this.apiService.findActiveProductByCategoryParam(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.products = res.data;
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else alert(res.message);
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
            this.apiService.getFeaturedProducts().subscribe((res: any) => {
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
