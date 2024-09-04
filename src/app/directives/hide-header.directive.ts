import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  Input,
  HostListener,
  Renderer2,
  NgZone,
  ElementRef,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appHideHeader]',
  standalone: true,
})
export class HideHeaderDirective implements OnInit {
  private lastScrollTop = 0;
  private isHidden = false;
  private header: any = HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Reference the header element
    this.header = document.querySelector('ion-header');
  }

  @HostListener('ionScroll', ['$event']) onContentScroll(event: any) {
    const scrollTop = event.detail.scrollTop;

    if (scrollTop > this.lastScrollTop && !this.isHidden) {
      // Scrolling down
      this.hideHeader();
    } else if (scrollTop < this.lastScrollTop && this.isHidden) {
      // Scrolling up
      this.showHeader();
    }

    this.lastScrollTop = scrollTop;
  }

  private hideHeader() {
    this.isHidden = true;
    this.renderer.setStyle(
      this.header,
      'transition',
      'transform 0.6s, opacity 0.6s'
    );
    this.renderer.setStyle(this.header, 'transform', 'translateY(-100%)');
    this.renderer.setStyle(this.header, 'opacity', '0');
  }

  private showHeader() {
    this.isHidden = false;
    this.renderer.setStyle(
      this.header,
      'transition',
      'transform 0.6s, opacity 0.6s'
    );
    this.renderer.setStyle(this.header, 'transform', 'translateY(0)');
    this.renderer.setStyle(this.header, 'opacity', '1');
  }
}
