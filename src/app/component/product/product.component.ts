import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';
import { isEmpty } from 'src/app/lib/object';
import { CustomerService } from 'src/app/service/customerservice';
import { ProductService } from 'src/app/service/productservice';
import { Category } from './../../interface/category';
import { PagingInfo } from './../../interface/paging_info';
import { jsonParse } from './../../lib/object';
import { ApiService } from './../../service/api.service';
import { NodeService } from './../../service/nodeservice';

@Component({
    templateUrl: './product.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../assets/demo/badges.scss'],
    styles: [
        `
            :host ::ng-deep {
                // .p-datatable-frozen-tbody {
                //     font-weight: bold;
                // }
                // .p-frozen-column {
                //     font-weight: bold;
                // }
                // .p-dialog .p-dialog-header {
                //     padding: 1rem 1.5rem;
                //     border: none;
                // }

                .p-progressbar {
                    height: 0.5rem;
                }
            }
        `
    ]
})
export class ProductComponent implements OnInit {
    isLoading: boolean = true;
    dialogBreakpoints = { '768px': '90vw' };

    pagingInfo = {} as PagingInfo;

    showProductDialog: boolean = false;
    showCategoryDialog: boolean = false;

    categories = [] as TreeNode[];
    products = [] as Product[];

    selectedCategory = {} as TreeNode;
    selectedProduct = {} as Product;

    productForm: FormGroup;
    categoryForm: FormGroup;

    category = {} as Category;
    product = {} as Product;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private dialogService: DialogService,
        private nodeService: NodeService,
        private customerService: CustomerService,
        private productService: ProductService,
        private messageService: MessageService,
        private confirmService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) {
        this.productForm = this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            icon: ['', Validators.maxLength(255)],
            order: [null, [Validators.maxLength(2), Validators.required]],
            label: ['', [Validators.maxLength(255), Validators.required]],
            children: this.formBuilder.array([])
        });

        this.categoryForm = this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            icon: ['', Validators.maxLength(255)],
            order: [null, [Validators.maxLength(2), Validators.required]],
            label: ['', [Validators.maxLength(255), Validators.required]],
            children: this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.pagingInfo = {
            filter: '',
            limit: 10,
            offset: 0,
            sortField: 'ID',
            sortOrder: 'ASC'
        };
        this.getData();
    }

    getData() {
        this.generateNode();

        this.apiService.getProducts(this.pagingInfo).subscribe((res: any) => {
            if (res.status === 200) {
                console.log(res);
            } else {
                alert(res.message);
            }
            this.isLoading = false;
        });

        this.apiService.getCategories(this.pagingInfo).subscribe((res: any) => {
            if (res.status === 200) {
                console.log(res);
            } else {
                alert(res.message);
            }
            this.isLoading = false;
        });

        // this.productService.getProducts().then((res) => {
        //     this.products = res;
        // });
    }

    onSubmit() {
        if (this.showProductDialog) {
            return this.submitProduct();
        } else {
            return this.submitCategory();
        }
    }

    async submitProduct() {
        this.product = jsonParse(this.productForm.value);
        if (isEmpty(this.selectedProduct)) {
            this.apiService.createProduct(this.product).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log(res);
                } else {
                    alert(res.message);
                }
            });
        } else {
            //edit
            this.apiService.updateProduct(this.product).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log(res);
                } else {
                    alert(res.message);
                }
            });
        }
    }

    async submitCategory() {
        this.category = jsonParse(this.categoryForm.value);
        if (isEmpty(this.selectedCategory)) {
            this.apiService.createCategory(this.category).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log(res);
                } else {
                    alert(res.message);
                }
            });
        } else {
            //edit
            this.apiService.updateCategory(this.category).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log(res);
                } else {
                    alert(res.message);
                }
            });
        }
    }

    resetCategoryForm() {
        this.categoryForm.reset();
    }

    resetProductForm() {
        this.productForm.reset();
    }

    onAddProduct() {
        this.selectedProduct = null;
        this.resetProductForm();
        this.showProductDialog = true;
    }

    onEditProduct() {
        if (isEmpty(this.selectedProduct)) return;
        // const category = this.selectedProduct[0];
        // this.categoryForm.get('label').setValue(category.label);
        // this.categoryForm.get('icon').setValue(category.icon);
        this.showProductDialog = true;
    }

    onDeleteProduct() {
        // if (isEmpty(this.selectedProduct)) return;
        // const category = this.selectedProduct[0];
        // this.categoryForm.get('label').setValue(category.label);
        // this.categoryForm.get('icon').setValue(category.icon);
        this.showProductDialog = true;
    }

    onSaveProduct() {
        this.showProductDialog = false;
    }

    onAddCategory() {
        this.selectedProduct = null;
        this.resetNode();
        this.resetCategoryForm();
        this.showCategoryDialog = true;
    }

    onEditCategory() {
        if (isEmpty(this.selectedCategory)) return;
        this.categoryForm.get('label').setValue(this.selectedCategory.label);
        this.categoryForm.get('icon').setValue(this.selectedCategory.icon);
        this.showCategoryDialog = true;
    }

    generateNode() {
        this.categories = [
            {
                label: 'All'
            },
            {
                label: 'Foods'
            },
            {
                label: 'Drinks'
            },
            {
                label: 'Desserts'
            },
            {
                label: 'Snacks'
            }
        ];
        this.resetNode();
    }

    resetNode() {
        this.selectedCategory = null;
        this.categories.forEach((node) => {
            if (node.partialSelected) node.partialSelected = false;
            if (node.children) {
                node.expanded = true;
                for (let subChildren of node.children) {
                    subChildren.expanded = true;
                    if (subChildren.partialSelected) subChildren.partialSelected = false;
                }
            }
        });
    }

    formatCurrency(value: any) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
    }

    isEmpty(data: any) {
        return isEmpty(data);
    }
}
