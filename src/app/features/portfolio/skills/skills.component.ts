import { Component, AfterViewInit, ElementRef, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  skills = [
    { name: 'Angular', icon: 'assets/img/skills/frontend/angular.png' },
    { name: 'TypeScript', icon: 'assets/img/skills/frontend/typeScript.png' },
    { name: 'JavaScript', icon: 'assets/img/skills/frontend/javaScript.png' },
    { name: 'HTML', icon: 'assets/img/skills/frontend/html.png' },
    { name: 'CSS', icon: 'assets/img/skills/frontend/css.png' },
    { name: 'Firebase', icon: 'assets/img/skills/tools/firebase.png' },
    { name: 'Git', icon: 'assets/img/skills/tools/git.png' },
    { name: 'REST-API', icon: 'assets/img/skills/tools/rest-api.png' },
    { name: 'Material Design', icon: 'assets/img/skills/frontend/materialDesign.png' },
    { name: 'Scrum', icon: 'assets/img/skills/tools/scrum.png' },
    { name: 'Growth mindset', icon: 'assets/img/skills/tools/growthMindset.png' }
  ];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initAnimations(), 100);
    }
  }

  initAnimations() {
    const root = this.el.nativeElement;
    
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector('#skills'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    timeline.from(root.querySelector('.section_subtitle'), {
      opacity: 0,
      y: 10,
      duration: 0.8,
      ease: 'power2.out'
    });

    timeline.from(root.querySelector('.skills_left'), {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.5');

    timeline.from(root.querySelectorAll('.skill_item'), {
      opacity: 0,
      y: 20, 
      duration: 0.8,
      stagger: 0.05,
      ease: 'power1.out'
    }, '-=0.7');
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}