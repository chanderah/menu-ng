import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppComponent } from '../app.component';
import { Menu } from '../interface/menu';
import { isEmpty } from '../lib/utils';
import { SharedService } from '../service/shared.service';
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li
                    app-menu
                    class="layout-menuitem-category"
                    *ngFor="let item of menus; let i = index"
                    [item]="item"
                    [index]="i"
                    [root]="true"
                    role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{ item.label }}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
            <p-divider></p-divider>
            <ng-container *ngIf="app.user">
                <button
                    pButton
                    pRipple
                    type="button"
                    (click)="onLogout()"
                    icon="pi pi-power-off"
                    label="Logout"
                    class="p-button-outlined">
                </button>
            </ng-container>
        </div>
    `
})
export class AppMenuComponent implements OnInit {
    isDevelopment: boolean = environment.production === false;
    menus: Menu[];

    constructor(
        public app: AppComponent,
        private sharedService: SharedService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getMenus();
    }

    getMenus() {
        this.getDefaultMenu();
        this.getDBMenu();
        if (!isEmpty(this.app.user)) {
            this.menus.push({
                label: 'Management',
                items: [
                    {
                        label: 'Live Orders',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/admin/order/live'],
                        badge: 'ADMIN'
                    },
                    { label: 'Manage Orders', icon: 'pi pi-fw pi-eye', routerLink: ['/admin/order'], badge: 'ADMIN' },
                    {
                        label: 'Manage Categories',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/admin/category'],
                        badge: 'ADMIN'
                    },
                    {
                        label: 'Manage Products',
                        icon: 'pi pi-fw pi-eye',
                        routerLink: ['/admin/product'],
                        badge: 'ADMIN'
                    },
                    { label: 'Manage Tables', icon: 'pi pi-fw pi-eye', routerLink: ['/admin/table'], badge: 'ADMIN' },
                    { label: 'Manage Users', icon: 'pi pi-fw pi-eye', routerLink: ['/admin/user'], badge: 'ADMIN' }
                ]
            });
        }
    }

    getDefaultMenu() {
        this.menus = [
            {
                label: 'Menu',
                // icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        icon: 'pi pi-fw pi-check-square',
                        label: 'Categories',
                        routerLink: ['/'],
                        items: [
                            {
                                label: 'All',
                                routerLink: ['/']
                            }
                        ]
                    }
                ]
            }
        ];
    }

    onLogout() {
        this.sharedService.removeUser();
        if (this.router.url == '/') this.sharedService.refreshPage();
        else this.router.navigate(['/']);
    }

    async getDBMenu() {
        this.app.categories.pipe(take(2)).subscribe((categories) => {
            if (categories) {
                categories.forEach((c) => {
                    this.menus[0].items[0].items.push({
                        id: c.id,
                        label: c.label,
                        routerLink: ['/'],
                        queryParams: { menu: c.param }
                    });
                });
            }
        });
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
