import { Component, OnInit} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [TranslateModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isEnglish = true;
  isMenuOpen = false;

  constructor(private languageService: LanguageService) { }

  ngOnInit() {
    this.languageService.currentLang$.subscribe(lang => {
      this.isEnglish = lang === 'en';
    });
  }

  changeLanguage() {
    const nextLang = this.isEnglish ? 'de' : 'en';
    this.languageService.changeLang(nextLang);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  get languageButtonSrc(): string {
    return this.isEnglish
      ? "/assets/imgs/header/english-button.png"
      : "/assets/imgs/header/german-button.png";
  }

  get languageButtonHoverSrc(): string {
    return this.isEnglish
      ? "/assets/imgs/header/english-button-hover.png"
      : "/assets/imgs/header/german-button-hover.png";
  }

  get languageButtonAlt(): string {
    return this.isEnglish
      ? "English button"
      : "German button";
  }

  get languageButtonHoverAlt(): string {
    return this.isEnglish
      ? "English button hover"
      : "German button hover";
  }
}
