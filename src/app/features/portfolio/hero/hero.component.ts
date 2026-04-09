import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, PLATFORM_ID, Inject, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  marqueeItems: string[] = [
    'HERO.MARQUEE.REMOTE_WORK',
    'HERO.MARQUEE.JOB_TITLE',
    'HERO.MARQUEE.LOCATION',
    'HERO.MARQUEE.OPEN_TO_WORK'
  ];

  @ViewChildren('circuitLine') circuitLines!: QueryList<ElementRef<SVGPathElement>>;
  @ViewChild('marqueeTrack') marqueeTrack!: ElementRef<HTMLDivElement>;

  private marqueeTween?: gsap.core.Tween;
  private langSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef,
    private translate: TranslateService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCircuitAnimation();
      this.initMarqueeAnimation();

      // Recalculate animation on language change to account for different text lengths
      this.langSubscription = this.translate.onLangChange.subscribe(() => {
        setTimeout(() => this.initMarqueeAnimation(), 100);
      });
    }
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
    this.marqueeTween?.kill();
  }

  private initMarqueeAnimation() {
    if (!this.marqueeTrack) return;

    this.marqueeTween?.kill();

    // Use a small delay to ensure the DOM is updated with translated text
    setTimeout(() => {
      const track = this.marqueeTrack.nativeElement;
      
      // We animate -33.333% because we have 3 for-loop items in the HTML
      this.marqueeTween = gsap.to(track, {
        xPercent: -33.333,
        duration: 30,
        ease: 'none',
        repeat: -1,
        overwrite: true
      });
    }, 50);
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
