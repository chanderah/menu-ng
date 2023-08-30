export interface Menu {
    id?: number;
    icon?: string;
    label: string;
    badge?: string;
    routerLink?: string[];
    queryParams?: object;
    items?: Menu[];
}
