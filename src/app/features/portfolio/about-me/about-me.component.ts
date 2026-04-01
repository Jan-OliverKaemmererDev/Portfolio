import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
})
export class AboutMeComponent implements AfterViewInit, OnDestroy {
  
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.initAnimation();
  }

  initAnimation() {
    const root = this.el.nativeElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector('#aboutMe'),
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    tl.from(root.querySelector('.about_content_layout'), {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    tl.from(root.querySelector('.profile_image_wrapper'), {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5'); 

    tl.from(root.querySelector('.section_title'), { opacity: 0, y: 20 }, '-=0.3')
      .from(root.querySelector('.about_title'), { opacity: 0, y: 20 }, '-=0.3')
      .from(root.querySelector('.about_description'), { opacity: 0, y: 20 }, '-=0.3');

    tl.from(root.querySelectorAll('.info_item'), {
      opacity: 0,
      x: 20,
      stagger: 0.2,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2');
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}