import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/interface/user';
import SharedUtil from 'src/app/lib/shared.util';
import { Category } from '../../../interface/category';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { jsonParse } from './../../../lib/shared.util';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['../../../../assets/user.styles.scss']
})
export class CategoryComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    showCategoryDialog: boolean = false;
    dialogBreakpoints = { '768px': '90vw' };

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    categories = [] as Category[];
    selectedCategory = {} as TreeNode;

    categoryForm: FormGroup;

    constructor(
        private app: AppComponent,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();

        this.categoryForm = this.formBuilder.group({
            id: [0],
            label: ['', [Validators.maxLength(255), Validators.required]]
        });
    }

    ngOnInit() {
        this.user = jsonParse(localStorage.getItem('user'));
        this.getCategories();
    }

    async getCategories() {
        this.app.getCategories();
        this.resetCategoryDialog();
    }

    async onSubmit() {
        this.isLoading = true;
        try {
            if (this.isEmpty(this.selectedCategory)) {
                this.apiService.createCategory(this.categoryForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        window.location.reload();
                    } else this.sharedService.errorToast(res.message);
                });
            } else {
                this.apiService.updateCategory(this.categoryForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        window.location.reload();
                    } else this.sharedService.errorToast(res.message);
                });
            }
        } finally {
            this.isLoading = false;
        }
    }

    resetCategoryDialog() {
        this.showCategoryDialog = false;
        this.selectedCategory = null;
        this.categoryForm.reset();
    }

    onDeleteCategory() {
        if (this.isEmpty(this.selectedCategory)) return;
        this.isLoading = true;
        this.apiService.deleteCategory(this.categoryForm.value).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.getCategories();
            } else {
                this.sharedService.errorToast(res.message);
            }
        });
    }

    onAddCategory() {
        this.resetNode();
        this.resetCategoryDialog();
        this.showCategoryDialog = true;
    }

    onEditCategory() {
        if (this.isEmpty(this.selectedCategory)) return;
        this.apiService.findCategoryById(jsonParse(this.selectedCategory)).subscribe((res: any) => {
            if (res.status === 200) {
                this.categoryForm.patchValue(res.data);
                this.showCategoryDialog = true;
            } else {
                this.sharedService.errorToast('Invalid session!');
                return this.getCategories();
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
