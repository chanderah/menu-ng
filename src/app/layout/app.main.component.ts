import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/layout/service/app.config.service';
import { AppConfig } from '../interface/appconfig';
import { AppComponent } from './../app.component';

@Component({
  selector: 'app-main',
  templateUrl: './app.main.component.html',
  animations: [
    trigger('submenu', [
      state('hidden', style({ height: '0px' })),
      state('visible', style({ height: '*' })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {
  subscription: Subscription;

  public menuInactiveDesktop: boolean;
  public menuActiveMobile: boolean;
  public overlayMenuActive: boolean;
  public staticMenuInactive: boolean = false;
  public profileActive: boolean;
  public topMenuActive: boolean;
  public topMenuLeaving: boolean;
  public theme: string;

  documentClickListener: () => void;
  menuClick: boolean;
  topMenuButtonClick: boolean;
  configActive: boolean;
  configClick: boolean;
  config: AppConfig;

  showCartDialog: boolean = false;

  constructor(
    public renderer: Renderer2,
    public app: AppComponent,
    public configService: ConfigService
  ) {}

  ngOnInit() {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe((config) => (this.config = config));
  }

  ngAfterViewInit() {
    // hides the overlay menu and top menu if outside is clicked
    this.documentClickListener = this.renderer.listen('body', 'click', (e) => {
      if (!this.isDesktop()) {
        if (!this.menuClick) this.menuActiveMobile = false;
        if (!this.topMenuButtonClick) this.hideTopMenu();
      } else {
        if (!this.menuClick && this.isOverlay()) this.menuInactiveDesktop = true;
        if (!this.menuClick) this.overlayMenuActive = false;
      }

      if (this.configActive && !this.configClick) this.configActive = false;
      this.configClick = false;
      this.menuClick = false;
      this.topMenuButtonClick = false;
    });
  }

  onScroll(e) {
    console.log('e', e);
    console.log('"CALLED"', 'CALLED');
  }

  toggleMenu(event: Event) {
    this.menuClick = true;
    if (this.isDesktop()) {
      if (this.app.menuMode === 'overlay') {
        if (this.menuActiveMobile) this.overlayMenuActive = true;
        this.overlayMenuActive = !this.overlayMenuActive;
        this.menuActiveMobile = false;
      } else if (this.app.menuMode === 'static') this.staticMenuInactive = !this.staticMenuInactive;
    } else {
      this.menuActiveMobile = !this.menuActiveMobile;
      this.topMenuActive = false;
    }
    event.preventDefault();
  }

  toggleProfile(event: Event) {
    this.profileActive = !this.profileActive;
    event.preventDefault();
  }

  toggleTopMenu(event: Event) {
    this.topMenuButtonClick = true;
    this.menuActiveMobile = false;

    if (this.topMenuActive) this.hideTopMenu();
    else this.topMenuActive = true;

    event.preventDefault();
  }

  hideTopMenu() {
    this.topMenuLeaving = true;
    setTimeout(() => {
      this.topMenuActive = false;
      this.topMenuLeaving = false;
    }, 1);
  }

  onMenuClick() {
    this.menuClick = true;
  }

  onConfigClick(event) {
    this.configClick = true;
  }

  isStatic() {
    return this.app.menuMode === 'static';
  }

  isOverlay() {
    return this.app.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth < 1024;
  }

  onSearchClick() {
    this.topMenuButtonClick = true;
  }

  get styleClass() {
    return {
      'layout-overlay': this.isOverlay(),
      'layout-static': this.isStatic(),
      'layout-theme-light': !this.config.dark,
      'layout-theme-dark': this.config.dark,
      'layout-overlay-sidebar-active': this.overlayMenuActive,
      'layout-static-sidebar-inactive': this.staticMenuInactive,
      'layout-mobile-sidebar-active': this.menuActiveMobile,
      'p-ripple-disabled': !this.config.ripple,
      'p-input-filled': this.config.inputStyle === 'filled',
    };
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
