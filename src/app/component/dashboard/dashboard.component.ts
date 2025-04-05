import SharedUtil from 'src/app/lib/shared.util';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { debounceTime, Subscription } from 'rxjs';
import { Category } from 'src/app/interface/category';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { enableBodyScroll, fadeInOut, isMobile, moveUp } from 'src/app/lib/utils';
import SwiperCore, { A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar, SwiperOptions, Thumbs, Virtual, Zoom } from 'swiper';
import { SharedService } from '../../service/shared.service';
import { PagingInfo } from './../../interface/paging_info';
import { ApiService } from './../../service/api.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../assets/user.styles.scss'],
  animations: [fadeInOut, moveUp],
})
export class DashboardComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  subscription!: Subscription;

  swiperOptions!: SwiperOptions;
  pagingInfo = {} as PagingInfo;

  products = [] as Product[];
  featuredProducts = [] as Product[];

  selectedCategory!: Category;
  selectedProduct!: Product;

  showOrderDialog: boolean = false;
  filterCtrl = new FormControl('');

  constructor(
    public appMain: AppMainComponent,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private apiService: ApiService
  ) {
    super();

    this.route.queryParams.subscribe(({ category }) => {
      this.selectedCategory = this.sharedService.categories.find((v) => v.param === category);
      if (!this.selectedCategory && router.url !== '/') {
        this.router.navigateByUrl('/');
      } else {
        this.initSwiper();
        this.getProducts();
      }
    });
  }

  ngOnInit() {
    this.filterCtrl.valueChanges.pipe(debounceTime(400)).subscribe(() => this.getProducts());
  }

  async getProducts(e?: LazyLoadEvent) {
    this.isLoading = true;
    this.pagingInfo = {
      filter: this.filterCtrl.value,
      condition: [
        {
          column: 'status',
          value: true,
        },
      ],
      limit: e?.rows || 20,
      offset: e?.first || 0,
      sortField: e?.sortField || 'NAME',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC',
    };

    if (this.selectedCategory) {
      this.pagingInfo.condition.push({ column: 'category_id', value: this.selectedCategory.id });
    }

    this.apiService.getProducts(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.products = res.data;
        this.pagingInfo.rowCount = res.rowCount;
      } else this.sharedService.errorToast(res.message);
    });
  }

  onShowOrderDialogChange(value: boolean) {
    if (value === false) enableBodyScroll();
    this.showOrderDialog = value;
  }

  onAddToCart(data: Product) {
    this.selectedProduct = data;
    this.showOrderDialog = true;
  }

  initSwiper() {
    if (!this.swiperOptions && !this.selectedCategory) {
      this.apiService.getProducts({ limit: 10, condition: [{ column: 'featured', value: true }] }).subscribe((res) => {
        if (res.status === 200) {
          this.featuredProducts = res.data;
          this.swiperOptions = {
            autoHeight: true,
            autoplay: {
              delay: 2500,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            },
            loop: true,
            centeredSlides: true,
            breakpoints: {
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 4,
              },
            },
          };
        }
      });
    }
  }

  onClickProduct(data: any) {
    this.dialogService
      .open(ProductDialogComponent, {
        header: data.name,
        data: data,
        closeOnEscape: true,
        dismissableMask: true,
        height: 'auto',
        width: isMobile ? '95vw' : '40vw',
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
