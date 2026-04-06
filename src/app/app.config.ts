import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import deTranslations from '../../public/assets/i18n/de.json';
import enTranslations from '../../public/assets/i18n/en.json';

import { routes } from './app.routes';

export class StaticTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang === 'de') return of(deTranslations);
    if (lang === 'en') return of(enTranslations);
    return of({}); 
  }
}

export function TranslateLoaderFactory() {
  return new StaticTranslateLoader();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: TranslateLoaderFactory
        },
        defaultLanguage: 'de',
        fallbackLang: 'en'
      })
    )
  ]
};
