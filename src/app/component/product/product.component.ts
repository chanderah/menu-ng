import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';
import { isEmpty } from 'src/app/lib/object';
import { CustomerService } from 'src/app/service/customerservice';
import { ProductService } from 'src/app/service/productservice';
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

    showProductDialog: boolean = false;
    showCategoryDialog: boolean = false;

    categories = [] as TreeNode[];
    products = [] as Product[];

    selectedCategory = {} as TreeNode;
    selectedProduct = {} as Product;

    productForm: FormGroup;
    categoryForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
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
        this.getData();
    }

    getData() {
        this.generateNode();
        this.productService.getProducts().then((res) => {
            this.products = res;
            this.isLoading = false;
        });
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
