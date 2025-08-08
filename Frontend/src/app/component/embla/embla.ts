import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import emblaCarousel, {
  EmblaOptionsType,
  EmblaCarouselType,
} from 'embla-carousel';

@Component({
  selector: 'app-embla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './embla.html',
  styleUrl: './embla.scss',
})
export class Embla implements AfterViewInit, OnDestroy {
  @Input() options: EmblaOptionsType = {};
  @Input() items: any[] = [];
  @Input() autoplay: boolean = false;
  @Input() interval: number = 3000;

  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef;

  embla?: EmblaCarouselType;
  private autoplayIntervalId: any;

ngAfterViewInit() {
  this.embla = emblaCarousel(this.viewportRef.nativeElement, this.options);

  if (this.autoplay) {
    this.autoplayIntervalId = setInterval(() => {
      if (this.embla) {
        if (this.embla.canScrollNext()) {
          this.embla.scrollNext();
        } else {
          this.embla.scrollTo(0);
        }
      }
    }, this.interval);
  }
}


  ngOnDestroy(): void {
    if (this.autoplayIntervalId) {
      clearInterval(this.autoplayIntervalId);
    }
  }
}
