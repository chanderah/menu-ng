import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Customer } from 'src/app/interface/customer';
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

                .p-progressbar {
                    height: 0.5rem;
                }
            }
        `
    ]
})
export class ProductComponent implements OnInit {
    isLoading: boolean = true;

    showCategoryDialogg: string = 'aaa';
    showCategoryDialog: boolean = false;
    data: Customer[];

    nodes: TreeNode[] = [];
    selectedNode: TreeNode[] = [];

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
            itemGroup: [null],
            categoryId: [{ value: null, disabled: true }],
            categoryItem: [null],
            status: [null],
            listSubCategory: this.formBuilder.array([])
        });

        this.categoryForm = this.formBuilder.group({
            id: [{ value: null, disabled: true }],
            icon: ['', Validators.maxLength(255)],
            label: ['', [Validators.maxLength(255), Validators.required]],
            children: this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.generateNode();
        this.customerService.getCustomersLarge().then((customers) => {
            // this.data = customers;
            this.isLoading = false;
        });
    }

    onAddCategory() {
        this.resetNode();
        this.showCategoryDialog = true;
    }

    onEditCategory() {
        if (this.selectedNode.length === 0) return;
        this.showCategoryDialog = true;
    }

    generateNode() {
        this.nodes = [
            {
                label: 'Categories',
                icon: 'pi pi-fw pi-check-square',
                children: [
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
                ]
            }
        ];

        this.resetNode();
    }

    resetNode() {
        this.selectedNode.length = 0;
        this.nodes.forEach((node) => {
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
}
