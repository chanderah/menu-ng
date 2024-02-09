import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, TreeNode } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Product, ProductOptions } from 'src/app/interface/product';
import { User } from 'src/app/interface/user';
import SharedUtil, { jsonParse, sortArrayByLabelProperty } from 'src/app/lib/shared.util';
import { Category } from '../../../interface/category';
import { PagingInfo } from '../../../interface/paging_info';
import { UploadEvent } from '../../../interface/upload_event';
import { resizeImg } from '../../../lib/image_resizer';
import { ApiService } from '../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    templateUrl: './product.component.html',
    styleUrls: ['../../../../assets/user.styles.scss'],
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
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
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
        this.user = jsonParse(localStorage.getItem('user')) as User;
        // this.getProducts();
        this.getCategories();
    }

    getProducts(e?: LazyLoadEvent) {
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
        this.apiService.getCategories().subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.categories = res.data.sort(sortArrayByLabelProperty);
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
        if (this.isEmpty(this.selectedProductOptions)) {
            this.selectedProductOptions = this.selectedProduct?.options;
        }
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
        try {
            if (this.isEmpty(this.selectedProduct)) {
                this.apiService.createProduct(this.productForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        console.log(res.message);
                        return this.getProducts();
                    } else alert(res.message);
                });
            } else {
                //edit
                this.apiService.updateProduct(this.productForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        console.log('success update product');
                        return this.getProducts();
                    } else alert(res.message);
                });
            }
        } finally {
            this.isLoading = false;
        }
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
        this.apiService.findProductById(this.selectedProduct).subscribe((res: any) => {
            if (res.status === 200) {
                this.showProductDialog = true;
                this.setProductForm(res.data);
            } else {
                this.sharedService.errorToast('Failed to get product!');
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
        this.sharedService.showConfirm('Are you sure to delete this product?').then((res) => {
            if (res) {
                this.isLoading = true;
                this.apiService.deleteProduct(this.selectedProduct).subscribe((res: any) => {
                    this.isLoading = false;
                    if (res.status === 200) {
                        this.getProducts();
                        this.sharedService.successToast('Product is deleted!');
                    } else this.sharedService.errorToast('Failed to delete the product.');
                });
            }
        });
    }

    resetNode() {
        const nodes = jsonParse(this.categories) as TreeNode[];
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
}
