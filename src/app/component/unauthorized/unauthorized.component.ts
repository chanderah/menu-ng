import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-unauthorized',
  template: `
    <div class="fixed inset-0 z-1000 flex justify-items-center align-items-center" style="width: 100dvw; height: 100dvh">
      <p class="text-center w-full font-semibold">Please scan your table QR Code to continue.</p>
    </div>
  `,
})
export class UnauthorizedComponent {
  constructor() {}
}
