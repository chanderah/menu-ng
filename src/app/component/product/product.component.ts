import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';
import { User } from 'src/app/interface/user';
import { isEmpty } from 'src/app/lib/object';
import { CustomerService } from 'src/app/service/customerservice';
import { ProductService } from 'src/app/service/productservice';
import { environment } from './../../../environments/environment';
import { Category } from './../../interface/category';
import { PagingInfo } from './../../interface/paging_info';
import { UploadEvent } from './../../interface/upload_event';
import { resizeImg } from './../../lib/image_resizer';
import { jsonParse } from './../../lib/object';
import { ApiService } from './../../service/api.service';
import { NodeService } from './../../service/nodeservice';

@Component({
    templateUrl: './product.component.html',
    styleUrls: ['../../../assets/user.styles.scss', '../../../assets/demo/badges.scss'],
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
    ],
    providers: [MessageService, ConfirmationService]
})
export class ProductComponent implements OnInit {
    isLoading: boolean = true;
    dialogBreakpoints = { '768px': '90vw' };

    env = environment;

    user: User = jsonParse(localStorage.getItem('user'));
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
            id: [0],
            image: [null, []],
            name: ['', [Validators.required]],
            code: ['', []],
            categoryId: [0, []],
            description: ['', []],
            price: [0, [Validators.required]],
            userCreated: ['', [Validators.required]]
        });

        this.categoryForm = this.formBuilder.group({
            id: [0],
            label: ['', [Validators.maxLength(255), Validators.required]],
            order: [0, [Validators.maxLength(2), Validators.required]],
            icon: ['', Validators.maxLength(255)],
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

        this.getProducts();
        this.getCategories();

        // this.generateNode();
    }

    getProducts() {
        this.isLoading = true;
        this.resetProductDialog();
        this.apiService.getProducts(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.products = res.data;
            } else alert(res.message);
        });
    }

    getCategories() {
        this.isLoading = true;
        this.resetCategoryDialog();
        this.apiService.getCategories(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.categories = res.data;
                this.generateCategoryOrderDropdown();
            } else {
                alert(res.message);
            }
        });
    }

    getPreviewImg() {
        const img: string = this.productForm.get('image').value;
        if (isEmpty(img)) return `${this.env.imagePath}/default_product_image.png`;
        if (img.includes('assets')) return `${this.env.publicPath}/${img}`;
        return img;
    }

    async onSelectImage(e: UploadEvent, fileUpload) {
        console.log(e.files);
        console.log(typeof fileUpload);
        try {
            const img = await resizeImg(e.files[0]);
            this.productForm.get('image').setValue(img);
        } catch (err) {
            alert(err);
        } finally {
            fileUpload.clear();
        }
    }

    async onSubmit() {
        this.isLoading = true;
        if (this.showProductDialog) await this.submitProduct();
        else await this.submitCategory();
        this.isLoading = false;
    }

    async submitProduct() {
        this.product = jsonParse(this.productForm.value);
        if (isEmpty(this.selectedProduct)) {
            //add
            this.product.userCreated = this.user.id;
            this.apiService.createProduct(this.product).subscribe((res: any) => {
                if (res.status === 200) {
                    this.getProducts();
                    console.log('success create product');
                } else alert(res.message);
            });
        } else {
            //edit
            this.apiService.updateProduct(this.product).subscribe((res: any) => {
                if (res.status === 200) {
                    this.getProducts();
                    console.log('success update product');
                } else alert(res.message);
            });
        }
    }

    async submitCategory() {
        this.category = jsonParse(this.categoryForm.value);
        if (isEmpty(this.selectedCategory)) {
            this.apiService.createCategory(this.category).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log('success create category');
                    this.getCategories();
                    this.resetCategoryDialog();
                } else {
                    alert(res.message);
                }
            });
        } else {
            //edit
            this.apiService.updateCategory(this.category).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log('success update category');
                    this.getCategories();
                    this.resetCategoryDialog();
                } else {
                    alert(res.message);
                }
            });
        }
    }

    resetCategoryDialog() {
        this.showCategoryDialog = false;
        this.categoryForm.reset();
    }

    resetProductDialog() {
        this.showProductDialog = false;
        this.productForm.reset();
    }

    generateCategoryOrderDropdown() {
        console.log(this.categories.length);
    }

    onAddProduct() {
        this.selectedProduct = null;
        this.resetProductDialog();
        this.showProductDialog = true;
    }

    onEditProduct() {
        if (isEmpty(this.selectedProduct)) return;
        this.productForm.patchValue(this.selectedProduct);
        this.showProductDialog = true;
    }

    onDeleteProduct() {
        if (isEmpty(this.selectedProduct)) return;
        this.isLoading = true;
        this.apiService.deleteProduct(this.selectedProduct).subscribe((res:any) => {
            if (res.status === 200) {
                this.getCategories()
                this.resetProductDialog()
                this.showProductDialog = false;
            } else {
                alert(res.message)
            }
        })
    }

    onDeleteCategory() {
        if (isEmpty(this.selectedCategory)) return;
        this.isLoading = true;
        this.apiService.deleteCategory(this.categoryForm.value).subscribe((res:any) => {
            if (res.status === 200) {
                this.getCategories()
                this.resetCategoryDialog()
            } else {
                alert(res.message)
            }
        })
    }


    onAddCategory() {
        this.selectedProduct = null;
        this.resetNode();
        this.resetCategoryDialog();
        this.showCategoryDialog = true;
    }

    onEditCategory() {
        if (isEmpty(this.selectedCategory)) return;
        this.categoryForm.patchValue(this.selectedCategory);
        this.showCategoryDialog = true;
    }

    generateNode() {
        // this.resetNode();
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
