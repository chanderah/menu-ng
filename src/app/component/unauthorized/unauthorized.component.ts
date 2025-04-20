import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-unauthorized',
  template: `
    <div class="flex justify-items-center align-items-center" style="width: 100vw; height: 100vh">
      <p class="text-center w-full font-semibold">Please scan your table QR Code to continue.</p>
    </div>
  `,
})
export class UnauthorizedComponent {
  constructor() {}
}
