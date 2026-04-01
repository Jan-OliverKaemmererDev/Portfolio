import { Component, AfterViewInit, ElementRef, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Technology {
  name: string;
  icon: string;
}

export interface Project {
  name: string;
  technologies: Technology[];
  previewImage: string;
  githubLink: string;
  liveTestLink: string;
  descriptionKey: string;
  isUpcoming?: boolean;
}

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './featured-projects.component.html',
  styleUrl: './featured-projects.component.scss',
})
export class FeaturedProjects implements AfterViewInit, OnDestroy {
  hoveredIndex: number | null = null;
  selectedProjectIndex: number | null = null;

   constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initEntranceAnimation(), 150);
    }
  }

 initEntranceAnimation() {
  const root = this.el.nativeElement;
  const rows = root.querySelectorAll('.featured_project_row');
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: root.querySelector('#featuredProjects'),
      start: 'top 95%',
      toggleActions: 'play none none none',
    }
  });

  timeline.from(root.querySelector('.featured_projects_subtitle'), {
    opacity: 0,
    y: 10,
    duration: 0.4,
    ease: 'power2.out'
  })

  .from([
    root.querySelector('.featured_projects_title'),
    root.querySelector('.featured_projects_description')
  ], {
    opacity: 0,
    y: 15,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.3')

  .from(rows, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out',
    clearProps: 'all'
  }, '-=0.5');
}

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }


  private techMap: Record<string, string> = {
    HTML: 'assets/img/skills/frontend/html.png',
    CSS: 'assets/img/skills/frontend/css.png',
    JavaScript: 'assets/img/skills/frontend/javaScript.png',
    Firebase: 'assets/img/skills/tools/firebase.png',
    Angular: 'assets/img/skills/frontend/angular.png',
    TypeScript: 'assets/img/skills/frontend/typeScript.png',
    Supabase: 'assets/img/skills/tools/supabase.jpeg',
    SCSS: 'assets/img/skills/frontend/scss.png',
  };

    projects: Project[] = [
    {
      name: 'Join',
      technologies: this.buildTech(['HTML', 'CSS', 'JavaScript', 'Firebase']),
      previewImage: 'assets/img/featured-projects/preview-projects/join.png',
      githubLink: 'https://github.com/Jan-OliverKaemmererDev/join',
      liveTestLink: 'https://join.jan-oliver-kaemmerer.dev',
      descriptionKey: 'FEATURED-PROJECTS.PROJECTS.JOIN.DESCRIPTION',
    },
    {
      name: 'El Pollo Loco',
      technologies: this.buildTech(['HTML', 'CSS', 'JavaScript']),
      previewImage: 'assets/img/featured-projects/preview-projects/el-pollo-loco.png',
      githubLink: 'https://github.com/Jan-OliverKaemmererDev/el_pollo_loco',
      liveTestLink: 'https://el-pollo-loco.jan-oliver-kaemmerer.dev',
      descriptionKey: 'FEATURED-PROJECTS.PROJECTS.EL_POLLO_LOCO.DESCRIPTION',
    },
    {
      name: 'Poll App',
      technologies: this.buildTech(['Angular', 'HTML', 'SCSS', 'TypeScript', 'Supabase']),
      previewImage: 'assets/img/featured-projects/preview-projects/poll-app.png',
      githubLink: '',
      liveTestLink: '',
      descriptionKey: 'FEATURED-PROJECTS.PROJECTS.POLL_APP.DESCRIPTION',
      isUpcoming: true
    }
  ];

  private buildTech(names: string[]): Technology[] {
    return names.map((name) => ({ name, icon: this.techMap[name] ?? '' }));
  }

  get selectedProject(): Project | null {
    return this.selectedProjectIndex !== null ? this.projects[this.selectedProjectIndex] : null;
  }

  get formattedProjectNumber(): string {
    return this.selectedProjectIndex !== null
      ? String(this.selectedProjectIndex + 1).padStart(2, '0')
      : '';
  }

  openDialog(index: number): void {
    this.selectedProjectIndex = index;
    document.body.style.overflow = 'hidden';
  }

  closeDialog(): void {
    this.selectedProjectIndex = null;
    document.body.style.overflow = '';
  }

  nextProject(): void {
    if (this.selectedProjectIndex !== null) {
      this.selectedProjectIndex = (this.selectedProjectIndex + 1) % this.projects.length;
    }
  }

  prevProject(): void {
    if (this.selectedProjectIndex !== null) {
      this.selectedProjectIndex =
        (this.selectedProjectIndex - 1 + this.projects.length) % this.projects.length;
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog_overlay')) {
      this.closeDialog();
    }
  }
}