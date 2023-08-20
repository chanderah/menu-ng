import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { Product } from 'src/app/interface/product';
import { User } from 'src/app/interface/user';
import { isEmpty } from 'src/app/lib/object';
import { environment } from './../../../environments/environment';
import { Category } from './../../interface/category';
import { PagingInfo } from './../../interface/paging_info';
import { UploadEvent } from './../../interface/upload_event';
import { resizeImg } from './../../lib/image_resizer';
import { jsonParse, sortArrayByLabelProperty } from './../../lib/object';
import { ApiService } from './../../service/api.service';

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

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    showProductDialog: boolean = false;
    showCategoryDialog: boolean = false;
    showAddProductOptionsDialog: boolean = false;

    categories = [] as Category[];
    products = [] as Product[];

    selectedCategory = {} as TreeNode;
    selectedProduct = {} as Product;

    categoryForm: FormGroup;
    productForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService // private dialogService: DialogService,
        // private customerService: CustomerService,
    ) // private nodeService: NodeService,
    // private productService: ProductService,
    // private messageService: MessageService,
    // private confirmService: ConfirmationService,
    {
        this.productForm = this.formBuilder.group({
            id: [null, []],
            image: [null, []],
            name: ['', [Validators.required]],
            code: ['', []],
            categoryId: [null, []],
            description: ['', []],
            price: [0, [Validators.required]],
            status: [true, [Validators.required]],
            userCreated: ['', [Validators.required]],
            options: this.formBuilder.array([])
        });

        this.categoryForm = this.formBuilder.group({
            id: [0],
            label: ['', [Validators.maxLength(255), Validators.required]]
        });
    }

    options(): FormArray {
        return this.productForm.get('options') as FormArray;
    }

    addOption() {
        this.options().push(
            this.formBuilder.group({
                name: ['', [Validators.required]],
                value: ['', [Validators.required]],
                price: [0, [Validators.required]]
            })
        );
    }

    deleteOption(index: number) {
        this.options().removeAt(index);
    }

    ngOnInit() {
        this.user = jsonParse(localStorage.getItem('user'));
        // this.getProducts();
        this.getCategories();
    }

    getProducts(e?: LazyLoadEvent) {
        this.isLoading = true;
        this.resetProductDialog();
        console.log(e);
        this.pagingInfo = {
            filter: '',
            limit: e.rows ?? 10,
            offset: e.first ?? 0,
            sortField: e.sortField ?? 'ID',
            sortOrder: e.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
        };
        this.apiService.getProducts(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.products = res.data;
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else {
                alert(res.message);
            }
        });
    }

    getCategories() {
        this.isLoading = true;
        this.resetCategoryDialog();
        this.apiService.getCategories().subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                res.data.sort(sortArrayByLabelProperty);
                this.categories = res.data;
            } else {
                alert(res.message);
            }
        });
    }

    getCategoryOfProduct(categoryId: number) {
        if (!categoryId) return;
        return this.categories.find((d) => d.id === categoryId)?.label;
    }

    getPreviewImg() {
        const img: string = this.productForm.get('image').value;
        if (isEmpty(img)) return `${this.env.imagePath}/default_product_image.png`;
        if (img.includes('assets')) return `${this.env.publicPath}/${img}`;
        return img;
    }

    openProductOptionsDialog() {
        this.addOption();
        this.showAddProductOptionsDialog = true;
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
        if (isEmpty(this.selectedProduct)) {
            this.apiService.createProduct(this.productForm.value).subscribe((res: any) => {
                if (res.status === 200) {
                    this.getProducts();
                    console.log('success create product');
                } else alert(res.message);
            });
        } else {
            //edit
            this.apiService.updateProduct(this.productForm.value).subscribe((res: any) => {
                if (res.status === 200) {
                    this.getProducts();
                    console.log('success update product');
                } else alert(res.message);
            });
        }
    }

    async submitCategory() {
        if (isEmpty(this.selectedCategory)) {
            this.apiService.createCategory(this.categoryForm.value).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log('success create category');
                    this.getCategories();
                } else {
                    alert(res.message);
                }
            });
        } else {
            //edit
            this.apiService.updateCategory(this.categoryForm.value).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log('success update category');
                    this.getCategories();
                } else {
                    alert(res.message);
                }
            });
        }
    }

    resetCategoryDialog() {
        this.showCategoryDialog = false;
        this.selectedCategory = null;
        this.categoryForm.reset();
    }

    resetProductDialog() {
        this.showProductDialog = false;
        this.selectedProduct = null;
        this.productForm.reset();
    }

    onAddProduct() {
        this.getCategories();
        this.resetProductDialog();
        this.selectedProduct = null;
        this.productForm.get('status').setValue(true);
        this.showProductDialog = true;
    }

    onEditProduct() {
        if (isEmpty(this.selectedProduct)) return;
        this.apiService.findProductById(this.selectedProduct).subscribe((res: any) => {
            if (res.status === 200) {
                this.productForm.patchValue(res.data);
                this.showProductDialog = true;
            } else {
                alert('Invalid session!');
                return this.getProducts();
            }
        });
        this.getCategories();
    }

    onDeleteProduct() {
        if (isEmpty(this.selectedProduct)) return;
        this.isLoading = true;
        this.apiService.deleteProduct(this.selectedProduct).subscribe((res: any) => {
            if (res.status === 200) {
                this.getCategories();
            } else {
                alert(res.message);
            }
        });
    }

    onDeleteCategory() {
        if (isEmpty(this.selectedCategory)) return;
        this.isLoading = true;
        this.apiService.deleteCategory(this.categoryForm.value).subscribe((res: any) => {
            if (res.status === 200) {
                this.getCategories();
            } else {
                alert(res.message);
            }
        });
    }

    onAddCategory() {
        this.selectedProduct = null;
        this.resetNode();
        this.resetCategoryDialog();
        this.showCategoryDialog = true;
    }

    onEditCategory() {
        if (isEmpty(this.selectedCategory)) return;
        this.apiService.findCategoryById(jsonParse(this.selectedCategory)).subscribe((res: any) => {
            if (res.status === 200) {
                this.categoryForm.patchValue(res.data);
                this.showCategoryDialog = true;
            } else {
                alert('Invalid session!');
                return this.getCategories();
            }
        });
    }

    resetNode() {
        const nodes: TreeNode[] = jsonParse(this.categories);
        nodes.forEach((node) => {
            if (node.partialSelected) node.partialSelected = false;
            if (node.children) {
                node.expanded = true;
                for (let subChildren of node.children) {
                    subChildren.expanded = true;
                    if (subChildren.partialSelected) subChildren.partialSelected = false;
                }
            }
        });
        this.selectedCategory = null;
    }

    formatCurrency(value: any) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
    }

    isEmpty(data: any) {
        return isEmpty(data);
    }
}
