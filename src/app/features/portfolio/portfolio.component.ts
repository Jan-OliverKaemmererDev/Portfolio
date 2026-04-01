import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { AboutMeComponent } from "./about-me/about-me.component";
import { SkillsComponent } from "./skills/skills.component";
import { FeaturedProjects } from './featured-projects/featured-projects.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-portfolio',
  imports: [HeroComponent, AboutMeComponent, SkillsComponent, FeaturedProjects, FeedbackComponent, ContactFormComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {

}
