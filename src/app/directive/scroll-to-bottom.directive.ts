import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[scrollToBottom]',
})
export class ScrollToBottomDirective implements OnInit, OnDestroy {
  @Input() threshold: number = 0;
  @Output() onScrollToBottom = new EventEmitter<boolean>();

  private subscription!: Subscription;

  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    this.subscription = fromEvent(window, 'scroll')
      .pipe(debounceTime(100))
      .subscribe(() => this.check());
  }

  check() {
    const element = this.el.nativeElement as HTMLElement;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    const isBottomVisible = rect.bottom <= viewportHeight + this.threshold;
    if (isBottomVisible) this.onScrollToBottom.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
