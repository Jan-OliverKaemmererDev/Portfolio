import { Component, AfterViewInit, ElementRef, OnDestroy, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [TranslateModule, RouterLink, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements AfterViewInit, OnDestroy {
  http = inject(HttpClient);
  mailSent = false;
  isSending = false;

  contactData = {
    name: "",
    email: "",
    message: "",
    privacy: false,
  };

  post = {
    endPoint: '/api/sendMail',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text' as 'json',
    },
  };

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initEntranceAnimation(), 50);
    }
  }

  initEntranceAnimation() {
    const root = this.el.nativeElement;
    const introElements = root.querySelector('.contact_intro').children;
    const formGroups = root.querySelectorAll('.input_group');
    const formFooter = root.querySelector('.form_footer');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector('#contactMe'),
        start: 'top 92%', 
        toggleActions: 'play none none none',
      }
    });

    tl.from(introElements, {
      opacity: 0,
      y: 8,
      duration: 0.5,
      stagger: 0.06,
      ease: 'expo.out'
    });

    tl.from(formGroups, {
      opacity: 0,
      y: 12,
      duration: 0.6,
      stagger: 0.08,
      ease: 'expo.out',
      clearProps: 'all'
    }, '-=0.45');

    tl.from(formFooter, {
      opacity: 0,
      y: 8,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'all'
    }, '-=0.3');
  }

  onSubmit(ngForm: NgForm) {
  if (ngForm.invalid) {
    ngForm.control.markAllAsTouched();
    return;
  }

  if (!this.isSending) {
    this.isSending = true;
    this.http.post(this.post.endPoint, this.contactData, this.post.options)
      .subscribe({
        next: (response) => {
          this.isSending = false;
          this.mailSent = true;
          ngForm.resetForm();
          setTimeout(() => { 
            this.mailSent = false; 
          }, 4000);
        },
        error: (error) => {
          console.error(error);
          this.isSending = false;
        },
        complete: () => console.info('send post complete'),
      });
  }
}

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}