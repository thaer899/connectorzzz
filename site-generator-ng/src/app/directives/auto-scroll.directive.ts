import { Directive, ElementRef, Input, OnChanges, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[autoScroll]'
})
export class AutoScrollDirective implements OnChanges, AfterViewInit {

  @Input() public set autoScroll(value: boolean) {
    this._enabled = value;
    if (value) {
      this.scrollToBottom();
    }
  }

  private _enabled: boolean = true;

  constructor(private _el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    if (this._enabled) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    // We use Renderer2 to provide a delay so that the container can finish rendering
    // This will ensure we get the correct scroll height
    this.renderer.setProperty(this._el.nativeElement, 'scrollTop', this._el.nativeElement.scrollHeight);
  }
}
