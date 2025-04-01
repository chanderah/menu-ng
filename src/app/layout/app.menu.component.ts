import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../interface/menu';
import { SharedService } from '../service/shared.service';
import { environment } from './../../environments/environment';
import { AppComponent } from '../app.component';
import { Category } from '../interface/category';

@Component({
  selector: 'app-menu',
  template: `
    <div class="layout-menu-container">
      <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
        <ng-container *ngFor="let item of menus; let i = index">
          <li
            *ngIf="isAdminMenu(item) ? sharedService.isAdmin : true"
            app-menu
            class="layout-menuitem-category"
            [item]="item"
            [index]="i"
            [root]="true"
            role="none">
            <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{ item.label }}</div>
            <ul role="menu">
              <ng-container *ngFor="let child of item.items">
                <li app-menuitem [item]="child" [index]="i" role="none"></li>
              </ng-container>
            </ul>
          </li>
        </ng-container>
      </ul>
      <p-divider></p-divider>
      <ng-container *ngIf="sharedService.user?.id">
        <button
          pButton
          pRipple
          type="button"
          (click)="onLogout()"
          icon="pi pi-power-off"
          label="Logout"
          class="p-button-outlined"></button>
      </ng-container>
    </div>
  `,
})
export class AppMenuComponent implements OnInit {
  isDevelopment: boolean = environment.production === false;
  menus: Menu[] = [];

  constructor(
    public app: AppComponent,
    public sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sharedService.categories$.subscribe((v) => {
      this.buildMenu(v);
    });
  }

  buildMenu(categories: Category[]) {
    this.menus = [
      {
        id: 0,
        // icon: 'pi pi-fw pi-briefcase',
        label: 'Menu',
        items: [
          {
            icon: 'pi pi-fw pi-check-square',
            label: 'Categories',
            routerLink: ['/'],
            items: [
              {
                label: 'All',
                routerLink: ['/'],
              },
              ...categories.map((v) => {
                return {
                  id: v.id,
                  label: v.label,
                  routerLink: ['/'],
                  queryParams: { menu: v.param },
                };
              }),
            ],
          },
        ],
      },
      {
        id: 1,
        // icon: 'pi pi-fw pi-briefcase',
        label: 'Management',
        items: [
          {
            label: 'Live Orders',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/admin/order/live'],
            badge: 'ADMIN',
          },
          {
            label: 'Manage Orders',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/admin/order'],
            badge: 'ADMIN',
          },
          {
            label: 'Manage Categories',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/admin/category'],
            badge: 'ADMIN',
          },
          {
            label: 'Manage Products',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/admin/product'],
            badge: 'ADMIN',
          },
          {
            label: 'Manage Tables',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/admin/table'],
            badge: 'ADMIN',
          },
          {
            label: 'Manage Users',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/admin/user'],
            badge: 'ADMIN',
          },
        ],
      },
    ];
  }

  async getDBMenu() {
    // this.app.categories.pipe(take(2)).subscribe((categories) => {
    //     if (categories) {
    //         categories.forEach((c) => {
    //             this.menus[0].items[0].items.push({
    //                 id: c.id,
    //                 label: c.label,
    //                 routerLink: ['/'],
    //                 queryParams: { menu: c.param },
    //             });
    //         });
    //     }
    // });
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = <HTMLDivElement>event.target;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }

  onLogout() {
    this.sharedService.clearLocalStorage();
    if (this.router.url == '/') this.sharedService.refreshPage();
    else this.router.navigate(['/']);
  }

  isAdminMenu(menu: Menu) {
    return menu.id === 1;
  }
}
