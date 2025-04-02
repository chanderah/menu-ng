import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { PagingInfo } from 'src/app/interface/paging_info';
import { User, UserRole } from 'src/app/interface/user';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from './../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../../../../assets/user.styles.scss'],
})
export class UserComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  dialogBreakpoints = { '768px': '90vw' };
  pagingInfo = {} as PagingInfo;
  showUserDialog: boolean = false;

  user = {} as User;

  users = [] as User[];
  userRoles = [] as UserRole[];
  selectedUser = {} as User;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private apiService: ApiService
  ) {
    super();

    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.maxLength(255), Validators.required]],
      username: ['', [Validators.maxLength(255), Validators.required]],
      password: ['', [Validators.maxLength(255), Validators.required]],
      roleId: ['', [Validators.maxLength(255), Validators.required]],
      status: [true, [Validators.maxLength(255), Validators.required]],
      createdAt: [null],
    });
  }

  ngOnInit() {
    this.user = this.jsonParse(localStorage.getItem('user')) as User;
    this.apiService.getUserRoles().subscribe((res) => {
      if (res.status === 200) this.userRoles = res.data;
    });
  }

  getUsers(e?: LazyLoadEvent) {
    this.showUserDialog = false;
    this.isLoading = true;
    this.pagingInfo = {
      filter: e?.filters?.global?.value ?? '',
      limit: e?.rows ?? 20,
      offset: e?.first ?? 0,
      sortField: e?.sortField ?? 'name',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC',
    };
    this.apiService.getUsers(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.users = res.data;
        if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
      } else this.sharedService.errorToast('Failed to get Users.');
    });
  }

  onSubmit() {
    const value: User = this.form.getRawValue();
    if (this.isEmpty(value.roleId) || this.isEmpty(value.username)) {
      return this.sharedService.errorToast('Please fill the required field');
    }

    if (this.isEmpty(value.password)) {
      return this.sharedService.errorToast('Please enter user password to continue');
    }

    value.name = this.capitalize(value.name);
    try {
      this.isLoading = true;
      if (this.selectedUser) {
        this.apiService.updateUser(value).subscribe((res) => {
          if (res.status === 200) this.getUsers();
          else this.sharedService.errorToast(res.message);
        });
      } else {
        this.apiService.register(value).subscribe((res) => {
          if (res.status === 200) this.getUsers();
          else this.sharedService.errorToast(res.message);
        });
      }
    } finally {
      this.isLoading = false;
    }
  }

  onAdd() {
    this.resetUserDialog();
    this.showUserDialog = true;
    this.form.get('status').setValue(true);
    this.form.get('username').enable();
  }

  onEdit() {
    this.showUserDialog = true;
    this.form.patchValue(this.selectedUser);
    this.form.get('username').disable();
  }

  onDelete() {}

  resetUserDialog() {
    this.showUserDialog = false;
    this.selectedUser = null;
    this.form.reset();
  }
}
