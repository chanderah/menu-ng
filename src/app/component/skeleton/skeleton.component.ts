import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-skeleton',
    template: `
        <div class="border-round border-1 surface-border p-4 mt-3">
            <div class="flex mb-3">
                <p-skeleton shape="circle" size="4rem" styleClass="mr-2"></p-skeleton>
                <div>
                    <p-skeleton width="10rem" styleClass="mb-2"></p-skeleton>
                    <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
                    <p-skeleton height=".5rem"></p-skeleton>
                </div>
            </div>
            <p-skeleton width="100%" height="150px"></p-skeleton>
            <div class="flex justify-content-between mt-3">
                <p-skeleton width="4rem" height="2rem"></p-skeleton>
                <p-skeleton width="4rem" height="2rem"></p-skeleton>
            </div>
        </div>
    `,
})
export class SkeletonComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
