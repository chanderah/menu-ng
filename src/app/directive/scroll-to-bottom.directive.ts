import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[scrollToBottom]',
})
export class ScrollToBottomDirective {
  @Output() onScrollToBottom = new EventEmitter<boolean>();

  constructor(private readonly el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(_e: Event) {
    const element = this.el.nativeElement;
    const clientHeight = (element.clientHeight * 101) / 100; // bottom 1%
    const isBottom = element.scrollHeight - element.scrollTop <= clientHeight;
    if (isBottom) this.onScrollToBottom.emit(true);
  }
}
