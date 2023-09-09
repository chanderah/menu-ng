import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Product, ProductOptions } from 'src/app/interface/product';
import { User } from 'src/app/interface/user';
import SharedUtil from 'src/app/lib/shared.util';
import { Category } from '../../../interface/category';
import { PagingInfo } from '../../../interface/paging_info';
import { UploadEvent } from '../../../interface/upload_event';
import { resizeImg } from '../../../lib/image_resizer';
import { ApiService } from '../../../service/api.service';

@Component({
    templateUrl: './product.component.html',
    styleUrls: ['../../../../assets/user.styles.scss', '../../../../assets/demo/badges.scss'],
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
export class ProductComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    dialogBreakpoints = { '768px': '90vw' };

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    showProductDialog: boolean = false;
    showCategoryDialog: boolean = false;
    saveProductOptions: boolean = false;
    showProductOptionsDialog: boolean = false;

    categories = [] as Category[];
    products = [] as Product[];

    selectedCategory = {} as TreeNode;
    selectedProduct = {} as Product;
    selectedProductOptions = [] as ProductOptions[];

    categoryForm: FormGroup;
    productForm: FormGroup;

    constructor(
        // private dialogService: DialogService,
        // private nodeService: NodeService,
        // private productService: ProductService,
        // private messageService: MessageService,
        // private confirmService: ConfirmationService,
        // private customerService: CustomerService,
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ) {
        super();
        this.productForm = this.formBuilder.group({
            id: [null, []],
            image: [null, []],
            name: ['', [Validators.required]],
            code: ['', []],
            categoryId: [null, []],
            description: ['', [Validators.maxLength(100)]],
            price: [0, [Validators.required]],
            featured: [false],
            status: [true],
            userCreated: ['', [Validators.required]],
            options: this.formBuilder.array([])
        });

        this.categoryForm = this.formBuilder.group({
            id: [0],
            label: ['', [Validators.maxLength(255), Validators.required]]
        });
    }

    ngOnInit() {
        this.user = this.jsonParse(localStorage.getItem('user'));
        // this.getProducts();
        this.getCategories();
    }

    getProducts(e?: LazyLoadEvent) {
        console.log(e);
        this.isLoading = true;
        this.resetProductDialog();
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 10,
            offset: e?.first || 0,
            sortField: e?.sortField || 'ID',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
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
                this.categories = res.data.sort(this.sortArrayByLabelProperty);
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
        if (this.isEmpty(img)) return `${this.env.imagePath}/default_product_image.png`;
        if (img.includes('assets')) return `${this.env.publicPath}/${img}`;
        return img;
    }

    options(): FormArray {
        return this.productForm.get('options') as FormArray;
    }

    addOption() {
        this.options().push(
            this.formBuilder.group({
                name: ['', [Validators.required]],
                multiple: [false],
                required: [false],
                values: this.formBuilder.array([])
            })
        );
        this.addOptionValues(this.options().length - 1);
    }

    deleteOption(index: number) {
        this.options().removeAt(index);
    }

    optionValues(optionIndex: number): FormArray {
        return this.options().at(optionIndex).get('values') as FormArray;
    }

    addOptionValues(optionIndex: number) {
        this.optionValues(optionIndex).push(
            this.formBuilder.group({
                value: ['', [Validators.required]],
                price: [null, [Validators.required]]
            })
        );
    }

    deleteOptionValues(optionIndex: number, optionValuesIndex: number) {
        this.optionValues(optionIndex).removeAt(optionValuesIndex);
    }

    openProductOptionsDialog() {
        if (this.isEmpty(this.selectedProductOptions)) this.selectedProductOptions = this.selectedProduct?.options;
        if (this.options().length === 0) this.addOption();
        this.saveProductOptions = false;
        this.showProductOptionsDialog = true;
    }

    onHideProductOptionsDialog() {
        if (this.saveProductOptions) {
            this.selectedProductOptions = this.options().value;
        } else {
            this.options().clear();
            for (let i = 0; i < this.selectedProductOptions?.length; i++) this.addOption();
            this.options().patchValue(this.selectedProductOptions);
        }
    }

    onSaveProductOptions() {
        // TODO: validate, change flag when done
        this.saveProductOptions = true;
        this.showProductOptionsDialog = false;
    }

    getSelectedProductOptionsName() {
        let data: string[] = [];
        this.options().controls.forEach((d: FormControl) => {
            data.push(d.value.name);
        });

        return data.length === 0 ? 'No Options' : data.join(', ');
    }

    async onSelectImage(e: UploadEvent, fileUpload: FileUpload) {
        console.log(e.files);
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
        else if (this.showCategoryDialog) await this.submitCategory();
        this.isLoading = false;
    }

    async submitProduct() {
        let product: Product = this.productForm.value;
        if (this.isEmpty(this.selectedProduct)) {
            this.apiService.createProduct(product).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log(res.message);
                    return this.getProducts();
                } else alert(res.message);
            });
        } else {
            //edit
            this.apiService.updateProduct(product).subscribe((res: any) => {
                if (res.status === 200) {
                    console.log('success update product');
                    return this.getProducts();
                } else alert(res.message);
            });
        }
    }

    async submitCategory() {
        if (this.isEmpty(this.selectedCategory)) {
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
        this.options().clear();
        this.productForm.reset();
    }

    onAddProduct() {
        this.getCategories();
        this.resetProductDialog();
        this.productForm.get('status').setValue(true);
        this.showProductDialog = true;
    }

    onEditProduct() {
        if (this.isEmpty(this.selectedProduct)) return;
        this.isLoading = true;
        this.showProductDialog = true;
        this.apiService.findProductById(this.selectedProduct).subscribe((res: any) => {
            if (res.status === 200) {
                console.log(res.data);
                this.setProductForm(res.data);
            } else {
                this.showProductDialog = false;
                alert('Failed to get product!');
            }
        });
        this.getCategories();
    }

    setProductForm(data: Product) {
        if (data.options) data.options.forEach(() => this.addOption());
        this.productForm.patchValue(data);
    }

    onDeleteProduct() {
        if (this.isEmpty(this.selectedProduct)) return;
        this.isLoading = true;
        this.apiService.deleteProduct(this.selectedProduct).subscribe((res: any) => {
            if (res.status === 200) {
                this.getProducts();
            } else {
                alert(res.message);
            }
        });
    }

    onDeleteCategory() {
        if (this.isEmpty(this.selectedCategory)) return;
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
        if (this.isEmpty(this.selectedCategory)) return;
        this.apiService.findCategoryById(this.jsonParse(this.selectedCategory)).subscribe((res: any) => {
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
        const nodes: TreeNode[] = this.jsonParse(this.categories);
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
}
