import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-customer',
    template: `
        <div class="flex justify-items-center align-items-center" style="width: 100%; height: 100vh">
            <p class="text-center w-full font-semibold">Please scan your table QR Code to continue.</p>
        </div>
    `,
})
export class CustomerComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
