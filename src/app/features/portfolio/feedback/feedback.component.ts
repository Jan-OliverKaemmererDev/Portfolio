import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements AfterViewInit, OnDestroy {
  feedbacks = [
    { id: 1 }, 
    { id: 2 }, 
    { id: 3 }
  ];
  currentIndex = 0;
  private isAnimating = false;

  @ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef<HTMLElement>>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private el: ElementRef) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCards();
      this.setupTiltEffect();
      
      setTimeout(() => {
        this.initEntranceAnimation();
      }, 100);
    }
  }

  private initEntranceAnimation() {
    const root = this.el.nativeElement;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.querySelector('#feedback'),
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });

    tl.from(root.querySelector('.section_subtitle'), {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: 'power2.out'
    })
    .from(root.querySelector('.section_title'), {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: 'power3.out'
    }, '-=0.2');

    tl.from([root.querySelector('.slider_wrapper'), root.querySelector('.slider_controls')], {
      opacity: 0,
      y: 20,
      scale: 0.98,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.3');
  }

  private initCards() {
    this.cards.forEach((cardRef, index) => {
      const card = cardRef.nativeElement;
      this.setInitialCardState(card, index);
    });
  }

  private setInitialCardState(card: HTMLElement, index: number) {
    if (index !== 0) {
      gsap.set(card, { 
        autoAlpha: 0, 
        xPercent: 100, 
        display: 'none' 
      });
      return;
    }
    
    gsap.set(card, { 
      autoAlpha: 1, 
      xPercent: 0, 
      display: 'block' 
    });
  }

  async goToSlide(index: number, direction?: 'next' | 'prev') {
  if (this.shouldSkipSlideChange(index)) 
    return;
  
  this.isAnimating = true;
  
  const isNext = direction ? (direction === 'next') : (index > this.currentIndex);
  
  const { currentCard, nextCard } = this.getCardsForTransition(index);
  this.currentIndex = index;
  
  this.prepareNextCardForTransition(nextCard);
  this.executeSlideTransition(currentCard, nextCard, isNext);
}

  private shouldSkipSlideChange(index: number): boolean {
    return this.isAnimating || index === this.currentIndex;
  }

  private getCardsForTransition(index: number) {
    const cardsArray = this.cards.toArray();
    const currentCard = cardsArray[this.currentIndex].nativeElement;
    const nextCard = cardsArray[index].nativeElement;
    return { currentCard, nextCard };
  }

  private prepareNextCardForTransition(nextCard: HTMLElement) {
    gsap.set(nextCard, { display: 'block' });
  }

  private executeSlideTransition(
    currentCard: HTMLElement, 
    nextCard: HTMLElement, 
    isNext: boolean
  ) {
    const timeline = gsap.timeline({
      onComplete: () => this.onTransitionComplete(currentCard)
    });

    this.animateCurrentCardOut(timeline, currentCard, isNext);
    this.animateNextCardIn(timeline, nextCard, isNext);
  }

  private onTransitionComplete(currentCard: HTMLElement) {
    gsap.set(currentCard, { display: 'none' });
    this.isAnimating = false;
  }

  private animateCurrentCardOut(
    timeline: gsap.core.Timeline, 
    card: HTMLElement, 
    isNext: boolean
  ) {
    timeline.to(card, {
      xPercent: isNext ? -100 : 100,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0);
  }

  private animateNextCardIn(
    timeline: gsap.core.Timeline, 
    card: HTMLElement, 
    isNext: boolean
  ) {
    timeline.fromTo(card, 
      { xPercent: isNext ? 100 : -100, autoAlpha: 0 },
      { 
        xPercent: 0, 
        autoAlpha: 1, 
        duration: 0.6, 
        ease: 'power2.inOut',
        clearProps: 'transform'
      }, 
      0
    );
  }

  next() {
  const nextIndex = (this.currentIndex + 1) % this.feedbacks.length;
  this.goToSlide(nextIndex, 'next');
}

  prev() {
  const prevIndex = (this.currentIndex - 1 + this.feedbacks.length) % this.feedbacks.length;
  this.goToSlide(prevIndex, 'prev');
}

  private setupTiltEffect() {
    this.cards.forEach((cardRef) => {
      const card = cardRef.nativeElement;
      this.attachTiltEventListeners(card);
    });
  }

  private attachTiltEventListeners(card: HTMLElement) {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      this.handleMouseMove(e, card);
    });

    card.addEventListener('mouseleave', () => {
      this.handleMouseLeave(card);
    });
  }

  private handleMouseMove(event: MouseEvent, card: HTMLElement) {
    if (!this.isCurrentCard(card)) return;
    
    const content = this.getCardContent(card);
    const { rotationY, rotationX } = this.calculateTiltRotation(event, card);
    
    this.applyTiltEffect(content, rotationY, rotationX);
  }

  private isCurrentCard(card: HTMLElement): boolean {
    return this.cards.toArray()[this.currentIndex].nativeElement === card;
  }

  private getCardContent(card: HTMLElement): HTMLElement {
    return card.querySelector('.card__content') as HTMLElement;
  }

  private calculateTiltRotation(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const dx = x - xc;
    const dy = y - yc;
    
    return {
      rotationY: dx / 20,
      rotationX: -dy / 20
    };
  }

  private applyTiltEffect(
    content: HTMLElement, 
    rotationY: number, 
    rotationX: number
  ) {
    gsap.to(content, {
      rotationY,
      rotationX,
      stretch: 0,
      duration: 0.4,
      ease: 'power3.out',
      transformPerspective: 1000
    });
  }

  private handleMouseLeave(card: HTMLElement) {
    const content = this.getCardContent(card);
    this.resetTiltEffect(content);
  }

  private resetTiltEffect(content: HTMLElement) {
    gsap.to(content, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: 'power3.out'
      });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }
}