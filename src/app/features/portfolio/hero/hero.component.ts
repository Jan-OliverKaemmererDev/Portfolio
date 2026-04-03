import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit {
  marqueeItems: string[] = [
    'HERO.MARQUEE.REMOTE_WORK',
    'HERO.MARQUEE.JOB_TITLE',
    'HERO.MARQUEE.LOCATION',
    'HERO.MARQUEE.OPEN_TO_WORK'
  ];

  @ViewChildren('circuitLine') circuitLines!: QueryList<ElementRef<SVGPathElement>>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private el: ElementRef) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCircuitAnimation();
    }
  }

  private initCircuitAnimation() {
    const paths = this.el.nativeElement.querySelectorAll('.circuit-line');
    
    paths.forEach((path: SVGPathElement) => {
      const length = path.getTotalLength();
      
      // Set initial state
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0
      });

      this.animateLine(path, length);
    });
  }

  private animateLine(path: SVGPathElement, length: number) {
    const delay = Math.random() * 5;
    const duration = 2 + Math.random() * 3;

    const tl = gsap.timeline({
      delay: delay,
      onComplete: () => this.animateLine(path, length)
    });

    // Use linear easing ('none') for perfectly smooth line drawing
    tl.fromTo(path, 
      { strokeDashoffset: length, autoAlpha: 0 },
      { 
        strokeDashoffset: 0, 
        autoAlpha: 0.15, 
        duration: duration, 
        ease: 'none' 
      }
    )
    .to(path, { autoAlpha: 0, duration: 1, ease: 'power1.inOut' });
  }
}
