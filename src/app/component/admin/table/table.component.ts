import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, ProductOptions } from 'src/app/interface/product';
import { User } from 'src/app/interface/user';
import SharedUtil from 'src/app/lib/shared.util';
import { trim } from 'src/app/lib/utils';
import { Category } from './../../../interface/category';
import { PagingInfo } from './../../../interface/paging_info';
import { ApiService } from './../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['../../../../assets/user.styles.scss']
})
export class TableComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    dialogBreakpoints = { '768px': '90vw' };

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    showTableDialog: boolean = false;
    showProductDialog: boolean = false;
    showCategoryDialog: boolean = false;
    saveProductOptions: boolean = false;
    showProductOptionsDialog: boolean = false;

    categories = [] as Category[];
    products = [] as Product[];
    tables = [] as Table[];

    selectedTable = {} as Table;
    selectedCategory = {} as TreeNode;
    selectedProduct = {} as Product;
    selectedProductOptions = [] as ProductOptions[];

    categoryForm: FormGroup;
    productForm: FormGroup;
    tableForm: FormGroup;

    goblok: string = 'goblok';

    constructor(
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();

        this.tableForm = this.formBuilder.group({
            id: [null],
            name: ['', [Validators.maxLength(255), Validators.required]],
            barcode: ['', [Validators.maxLength(255), Validators.required]],
            status: [true, [Validators.maxLength(255), Validators.required]],
            userCreated: [null, []]
        });
    }

    ngOnInit() {
        this.user = this.jsonParse(localStorage.getItem('user')) as User;
        this.getTables();
    }

    getTables(e?: LazyLoadEvent) {
        this.resetTableDialog();
        this.isLoading = true;
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: e?.sortField || 'name',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
        };

        this.apiService.getTables(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.tables = res.data;
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else {
                this.sharedService.errorToast('Failed to get Tables data.');
            }
        });
    }

    onSubmit() {
        this.isLoading = true;
        try {
            if (this.isEmpty(this.selectedTable)) {
                this.apiService.createTable(this.tableForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        this.getTables();
                        this.sharedService.successToast('Success!');
                    } else {
                        this.sharedService.errorToast('Failed to create.');
                    }
                });
            } else {
                this.apiService.updateTable(this.tableForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        this.getTables();
                        this.sharedService.successToast('Success!');
                    } else {
                        this.sharedService.errorToast('Failed to create.');
                    }
                });
            }
        } finally {
            this.isLoading = false;
        }
    }

    onAdd() {
        this.resetTableDialog();
        this.showTableDialog = true;
        this.tableForm.get('status').setValue(true);
    }

    onEdit() {
        this.showTableDialog = true;
        this.tableForm.patchValue(this.selectedTable);
    }

    resetTableDialog() {
        this.showTableDialog = false;
        this.selectedTable = null;
        this.tableForm.reset();
    }

    downloadQrCode() {
        const canvas = document.getElementById('qrcode').children[0] as HTMLCanvasElement;

        const a = document.createElement('a');
        a.setAttribute('download', trim(this.tableForm.get('name').value).toLowerCase() + '.png');
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            a.setAttribute('href', url);
            a.click();
        });
    }
}
