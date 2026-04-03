import { Component, OnInit, AfterViewInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class LoaderComponent implements OnInit, AfterViewInit {
  isVisible: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimation();
    }
  }

  private initAnimation() {
    const container = this.el.nativeElement;
    const brackets = container.querySelectorAll('.bracket');
    const nameContainer = container.querySelector('.name_container');
    const nameText = container.querySelector('.name_text');
    const overlay = container.querySelector('.overlay');

    const tl = gsap.timeline();

    // 1. Brackets appear at the center
    tl.fromTo(brackets, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    )
    // 2. Name builds up (expand from center)
    .to(nameContainer, {
      width: "100%", // This will expand to fit the container or we can use max-content in CSS
      duration: 1.2,
      ease: "power3.inOut",
    })
    // 3. Nachfedern (Bounce)
    .to(brackets, {
      scale: 1.2,
      duration: 0.2,
      ease: "power2.out"
    }, "-=0.2")
    .to(brackets, {
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1.2, 0.5)"
    })
    // 4. Exit after 0.5s
    .to(overlay, {
      y: "-100%",
      duration: 0.8,
      ease: "power4.inOut",
      delay: 0.5,
      onComplete: () => {
        this.isVisible = false;
      }
    });
  }
}
