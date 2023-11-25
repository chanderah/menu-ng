import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    template: `
        <div class="flex justify-items-center align-items-center" style="width: 100%; height: 100vh">
            <p class="text-center w-full font-semibold">Unauthorized.</p>
        </div>
    `
})
export class UnauthorizedComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
