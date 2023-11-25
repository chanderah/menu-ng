import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { Menu } from '../interface/menu';
import { SharedService } from '../service/shared.service';
import { environment } from './../../environments/environment';
import { Category } from './../interface/category';
import { AppMainComponent } from './app.main.component';

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

            <ng-container *ngIf="user">
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
    user: User;
    categories: Category[];

    constructor(
        public appMain: AppMainComponent,
        private sharedService: SharedService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getMenus();
        this.user = this.sharedService.getUser();
    }

    getMenus() {
        this.getDefaultMenu();
        this.getDBMenu();
        // if (this.isDevelopment) this.getDemoMenu();
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
            },
            {
                label: 'Management',
                items: [
                    { label: 'Live Orders', icon: 'pi pi-fw pi-eye', routerLink: ['/order/live'], badge: 'ADMIN' },
                    { label: 'Manage Orders', icon: 'pi pi-fw pi-eye', routerLink: ['/order'], badge: 'ADMIN' },
                    { label: 'Manage Categories', icon: 'pi pi-fw pi-eye', routerLink: ['/category'], badge: 'ADMIN' },
                    { label: 'Manage Products', icon: 'pi pi-fw pi-eye', routerLink: ['/product'], badge: 'ADMIN' },
                    { label: 'Manage Tables', icon: 'pi pi-fw pi-eye', routerLink: ['/table'], badge: 'ADMIN' }
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
        this.categories = await this.sharedService.getCategories();
        this.categories.forEach((data: Category) => {
            this.menus[0].items[0].items.push({
                id: data.id,
                label: data.label,
                routerLink: ['/'],
                queryParams: { menu: data.param }
            });
        });
    }

    // getDemoMenu() {
    //     const demo = [
    //         {
    //             label: 'UI Components',
    //             items: [
    //                 { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
    //                 { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
    //                 { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
    //                 {
    //                     label: 'Invalid State',
    //                     icon: 'pi pi-fw pi-exclamation-circle',
    //                     routerLink: ['/uikit/invalidstate']
    //                 },
    //                 {
    //                     label: 'Button',
    //                     icon: 'pi pi-fw pi-mobile',
    //                     routerLink: ['/uikit/button'],
    //                     class: 'rotated-icon'
    //                 },
    //                 { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
    //                 { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
    //                 { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
    //                 { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
    //                 { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
    //                 { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
    //                 { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], preventExact: true },
    //                 { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
    //                 { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
    //                 { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
    //                 { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
    //             ]
    //         },
    //         {
    //             label: 'Prime Blocks',
    //             items: [
    //                 { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
    //                 {
    //                     label: 'All Blocks',
    //                     icon: 'pi pi-fw pi-globe',
    //                     url: ['https://www.primefaces.org/primeblocks-ng'],
    //                     target: '_blank'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Utilities',
    //             items: [
    //                 { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/icons'] },
    //                 {
    //                     label: 'PrimeFlex',
    //                     icon: 'pi pi-fw pi-desktop',
    //                     url: ['https://www.primefaces.org/primeflex/'],
    //                     target: '_blank'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Pages',
    //             items: [
    //                 { label: 'Crud', icon: 'pi pi-fw pi-user-edit', routerLink: ['/pages/crud'] },
    //                 { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline'] },
    //                 { label: 'Landing', icon: 'pi pi-fw pi-globe', routerLink: ['pages/landing'] },
    //                 { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['pages/login'] },
    //                 { label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['pages/error'] },
    //                 { label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['pages/notfound'] },
    //                 { label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['pages/access'] },
    //                 { label: 'Empty', icon: 'pi pi-fw pi-circle', routerLink: ['/pages/empty'] }
    //             ]
    //         },
    //         {
    //             label: 'Hierarchy',
    //             items: [
    //                 {
    //                     label: 'Submenu 1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         {
    //                             label: 'Submenu 1.1',
    //                             icon: 'pi pi-fw pi-bookmark',
    //                             items: [
    //                                 { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                                 { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //                                 { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
    //                             ]
    //                         },
    //                         {
    //                             label: 'Submenu 1.2',
    //                             icon: 'pi pi-fw pi-bookmark',
    //                             items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         {
    //                             label: 'Submenu 2.1',
    //                             icon: 'pi pi-fw pi-bookmark',
    //                             items: [
    //                                 { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                                 { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
    //                             ]
    //                         },
    //                         {
    //                             label: 'Submenu 2.2',
    //                             icon: 'pi pi-fw pi-bookmark',
    //                             items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Get Started',
    //             items: [
    //                 {
    //                     label: 'Documentation',
    //                     icon: 'pi pi-fw pi-question',
    //                     routerLink: ['/documentation']
    //                 },
    //                 {
    //                     label: 'View Source',
    //                     icon: 'pi pi-fw pi-search',
    //                     url: ['https://github.com/primefaces/sakai-ng'],
    //                     target: '_blank'
    //                 }
    //             ]
    //         }
    //     ];
    //     this.menus = this.menus.concat(demo);
    // }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
