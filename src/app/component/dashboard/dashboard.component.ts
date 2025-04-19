import SharedUtil from 'src/app/lib/shared.util';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { debounceTime, filter, map, of, Subscription, switchMap } from 'rxjs';
import { Category } from 'src/app/interface/category';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { fadeInOut, isDesktop, isMobile, moveUp } from 'src/app/lib/utils';
import SwiperCore, { A11y, Autoplay, Controller, Navigation, Pagination, Scrollbar, SwiperOptions, Thumbs, Virtual, Zoom } from 'swiper';
import { SharedService } from '../../service/shared.service';
import { PagingInfo } from './../../interface/paging_info';
import { ApiService } from './../../service/api.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { CustomerService } from 'src/app/service/customer.service';
import { ToastService } from 'src/app/service/toast.service';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay, Thumbs, Controller]);

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../../assets/styles/user.styles.scss'],
  animations: [fadeInOut, moveUp],
})
export class DashboardComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  subscription!: Subscription;

  swiperOptions!: SwiperOptions;
  pagingInfo: PagingInfo = {
    page: 1,
    limit: 20,
    sortField: 'NAME',
    sortOrder: 'ASC',
  };

  products = [] as Product[];
  featuredProducts = [] as Product[];

  selectedCategory!: Category;
  selectedProduct!: Product;

  showOrderDialog: boolean = false;
  filterCtrl = new FormControl('');

  constructor(
    public customerService: CustomerService,
    private appMain: AppMainComponent,
    private sharedService: SharedService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private apiService: ApiService
  ) {
    super();

    this.route.queryParams
      .pipe(
        map(({ category }) => {
          this.selectedCategory = this.sharedService.categories.find((v) => v.param === category);
          if (!this.selectedCategory && router.url !== '/') {
            this.router.navigateByUrl('/');
            return false;
          }
          return true;
        }),
        filter((shouldCallApi) => shouldCallApi),
        switchMap(() => {
          this.getFeaturedProducts();
          this.getProducts();
          return of(true);
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.filterCtrl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.getProducts();
    });
  }

  onClickFilter(e: Event) {
    const isOpened = this.appMain.overlayMenuActive || this.appMain.menuActiveMobile || true;
    if (!isDesktop || (isDesktop && !isOpened)) {
      this.appMain.toggleMenu(e);
    }

    const ulElement = document.querySelector('ul#menu');
    ulElement.classList.add('border-active');
    setTimeout(() => {
      ulElement.classList.remove('border-active');
    }, 800);
  }

  async getProducts(page: number = 1) {
    this.isLoading = true;

    this.pagingInfo.filter = this.filterCtrl.value;
    this.pagingInfo.page = page;
    this.pagingInfo.condition = [{ column: 'status', value: true }];
    if (this.selectedCategory) {
      this.pagingInfo.condition.push({ column: 'category_id', value: this.selectedCategory.id });
    }

    this.apiService.getProducts(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        const data = [
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
          ...res.data,
        ];

        this.pagingInfo.rowCount = res.rowCount;
        this.products = page === 1 ? data : [...this.products, ...data];
        if (page === 1) {
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });
        }
      } else this.toastService.errorToast(res.message);
    });
  }

  onScrollProducts() {
    if (this.isLoading) return;

    if (this.products.length < this.pagingInfo.rowCount) {
      this.getProducts(this.pagingInfo.page + 1);
    }
  }

  onShowOrderDialogChange(value: boolean) {
    this.showOrderDialog = value;
  }

  onAddToCart(data: Product) {
    this.selectedProduct = data;
    this.showOrderDialog = true;
  }

  getFeaturedProducts() {
    if (this.swiperOptions) return;
    // if (this.swiperOptions && this.selectedCategory) return;
    this.apiService
      .getProducts({
        limit: 10,
        condition: [
          { column: 'featured', value: true },
          { column: 'status', value: true },
        ],
      })
      .subscribe((res) => {
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

  onClickOrders() {
    this.router.navigateByUrl('/order');
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
