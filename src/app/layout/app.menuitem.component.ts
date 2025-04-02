import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from '../layout/service/app.menu.service';
import { AppMainComponent } from './app.main.component';
import SharedUtil from '../lib/shared.util';
import { SharedService } from '../service/shared.service';

@Component({
  selector: '[app-menuitem]',
  templateUrl: './app.menuitem.component.html',
  host: {
    '[class.active-menuitem]': 'active',
  },
  animations: [
    trigger('children', [
      state(
        'void',
        style({
          height: '0px',
        })
      ),
      state(
        'hiddenAnimated',
        style({
          height: '0px',
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*',
        })
      ),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
})
export class AppMenuitemComponent extends SharedUtil implements OnInit, OnDestroy {
  @Input() item!: any;
  @Input() index!: number;
  @Input() root!: boolean;
  @Input() parentKey!: string;

  menuSourceSubscription!: Subscription;

  active = false;
  key: string;

  constructor(
    public app: AppMainComponent,
    public router: Router,
    public sharedService: SharedService,
    private menuService: MenuService
  ) {
    super();

    this.menuSourceSubscription = this.menuService.menuSource$.subscribe((key) => {
      // deactivate current active menu
      if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
        this.active = false;
      }
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.item.routerLink) {
        this.updateActiveStateFromRoute();
      } else {
        this.active = false;
      }
    });
  }

  ngOnInit() {
    if (this.item.routerLink) this.updateActiveStateFromRoute();
    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
  }

  updateActiveStateFromRoute() {
    this.active =
      //   this.item.label === 'Categories' ||
      this.router.isActive(this.item.routerLink[0], {
        paths: 'exact',
        queryParams: 'ignored',
        // queryParams: this.item.items ? 'ignored' : 'exact',
        matrixParams: 'ignored',
        fragment: 'ignored',
      });
  }

  itemClick(event: Event) {
    event.stopPropagation();
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // notify other items
    this.menuService.onMenuStateChange(this.key);

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;

      // hide overlay menus
      this.app.menuActiveMobile = false;

      if (this.app.isDesktop() && this.app.isOverlay()) {
        this.app.menuInactiveDesktop = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }
  }
}
