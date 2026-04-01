import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';
  
  private currentLangSubject = new BehaviorSubject<string>(this.savedLang);
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    this.changeLang(this.savedLang);
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', lang);
    }

    document.documentElement.lang = lang;
  }
}