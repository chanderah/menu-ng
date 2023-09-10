import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { User } from 'src/app/interface/user';
import SharedUtil from 'src/app/lib/shared.util';
import { Category } from '../../../interface/category';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
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

    async getCategories() {
        this.isLoading = true;
        this.categories = await this.sharedService.getCategories();
        this.resetCategoryDialog();
        this.isLoading = false;
    }

    ngOnInit() {
        this.user = this.jsonParse(localStorage.getItem('user'));
        this.getCategories();
    }

    async onSubmit() {
        this.isLoading = true;
        try {
            if (this.isEmpty(this.selectedCategory)) {
                this.apiService.createCategory(this.categoryForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        this.getCategories();
                        this.sharedService.showSuccess('Please reload the page to see the changes.');
                    } else {
                        alert(res.message);
                    }
                });
            } else {
                this.apiService.updateCategory(this.categoryForm.value).subscribe((res: any) => {
                    if (res.status === 200) {
                        this.getCategories();
                        this.sharedService.showSuccess('Please reload the page to see the changes.');
                    } else {
                        alert(res.message);
                    }
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
                alert(res.message);
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
}
