import { Aes256Service } from './../../../service/aes256.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import SharedUtil from 'src/app/lib/shared.util';
import { trim } from 'src/app/lib/utils';
import { PagingInfo } from './../../../interface/paging_info';
import { ApiService } from './../../../service/api.service';
import { SharedService } from './../../../service/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['../../../../assets/user.styles.scss'],
})
export class TableComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  dialogBreakpoints = { '768px': '90vw' };

  pagingInfo = {} as PagingInfo;

  showTableDialog: boolean = false;

  tables = [] as Table[];
  selectedTable!: Table;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private apiService: ApiService,
    private aes256Service: Aes256Service
  ) {
    super();
  }

  ngOnInit() {
    this.setForm();
    this.getTables();
  }

  getTables(e?: LazyLoadEvent) {
    this.isLoading = true;
    this.pagingInfo = {
      filter: e?.filters?.global?.value || '',
      limit: e?.rows || 20,
      offset: e?.first || 0,
      sortField: e?.sortField || 'name',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC',
    };

    this.apiService.getTables(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.tables = res.data;
        if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
      } else {
        this.sharedService.errorToast('Failed to get Tables data.');
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    try {
      if (this.isEmpty(this.selectedTable)) {
        this.apiService.createTable(this.form.value).subscribe((res) => {
          if (res.status === 200) {
            this.getTables();
            this.sharedService.successToast('Success!');
          } else {
            this.sharedService.errorToast('Failed to create.');
          }
        });
      } else {
        this.apiService.updateTable(this.form.value).subscribe((res) => {
          if (res.status === 200) {
            this.getTables();
            this.sharedService.successToast('Success!');
          } else {
            this.sharedService.errorToast('Failed to create.');
          }
        });
      }
    } finally {
      this.isLoading = false;
    }
  }

  onAdd() {
    this.setForm();
    this.form.get('status').setValue(true);
    this.showTableDialog = true;
  }

  onEdit() {
    this.setForm();

    const barcode = `${environment.appUrl}?table=${this.aes256Service.encrypt(this.selectedTable.id.toString())}`;
    this.form.patchValue({
      ...this.selectedTable,
      barcode,
    });
    this.showTableDialog = true;
  }

  downloadQrCode() {
    const canvas = document.getElementById('qrcode').children[0] as HTMLCanvasElement;

    const a = document.createElement('a');
    a.setAttribute('download', trim(this.form.get('name').value).toLowerCase() + '.png');
    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      a.setAttribute('href', url);
      a.click();
    });
  }

  setForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.maxLength(255), Validators.required]],
      barcode: ['', [Validators.maxLength(255), Validators.required]],
      status: [true, [Validators.maxLength(255), Validators.required]],
      userCreated: [this.sharedService.user.id],
    });
  }
}
