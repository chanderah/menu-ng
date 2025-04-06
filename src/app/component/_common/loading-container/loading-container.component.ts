import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-container',
  templateUrl: './loading-container.component.html',
  styleUrls: ['./loading-container.component.scss'],
})
export class LoadingContainerComponent {
  @Input() isLoading: boolean = false;
  @Input() hideWhenLoading: boolean = false;
  @Input() size: number = 16;
  @Input() color: string = '#fff';

  constructor() {}
}
