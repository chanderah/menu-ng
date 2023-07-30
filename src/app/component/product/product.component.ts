import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
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
    data: Customer[];

    isLoading: boolean = true;

    nodes: TreeNode[] = [];
    selectedNode: TreeNode;

    constructor(
        private nodeService: NodeService,
        private customerService: CustomerService,
        private productService: ProductService,
        private messageService: MessageService,
        private confirmService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.generateNode();
        this.customerService.getCustomersLarge().then((customers) => {
            // this.data = customers;
            this.isLoading = false;
        });
    }

    onAddCategory() {
        console.log(this.selectedNode);
    }

    onEditCategory() {
        console.log(this.selectedNode);
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

        this.nodes.forEach((node) => {
            if (node.children) {
                node.expanded = true;
                for (let subChildren of node.children) subChildren.expanded = true;
            }
        });
    }

    formatCurrency(value: any) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
    }
}
