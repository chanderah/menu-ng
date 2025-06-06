import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../interface/menu';
import { SharedService } from '../service/shared.service';
import { environment } from './../../environments/environment';
import { AppComponent } from '../app.component';
import { CONSTANTS } from '../constant/common';
import { merge } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
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
    merge(this.sharedService.categories$, this.sharedService.user$).subscribe(() => {
      this.buildMenu();
    });
  }

  buildMenu() {
    this.menus = [
      {
        id: 1,
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
              ...this.sharedService.categories.map((v) => {
                return {
                  id: v.id,
                  label: v.label,
                  routerLink: ['/'],
                  queryParams: { category: v.param },
                };
              }),
            ],
          },
        ],
      },
    ];

    if (this.sharedService.isAdmin) {
      this.menus.push(this.menuAdmin);
    }
  }

  get menuAdmin() {
    return {
      id: 2,
      label: 'Management',
      items: CONSTANTS.ADMIN_MENU.filter((v) => this.sharedService.hasAccess(v.role)).map((v) => {
        return {
          ...v,
          icon: 'pi pi-fw pi-eye',
          badge: CONSTANTS.USER_ROLE[v.role],
          routerLink: [v.routerLink],
        };
      }),
    };
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = <HTMLDivElement>event.target;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }

  onLogout() {
    this.router.navigateByUrl('/login', {
      state: { logout: true },
    });
  }
}
