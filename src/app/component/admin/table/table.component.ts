import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import SharedUtil from 'src/app/lib/shared.util';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent extends SharedUtil implements OnInit {
    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {}
}
