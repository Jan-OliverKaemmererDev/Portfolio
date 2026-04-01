import { Routes } from '@angular/router';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { ImprintComponent } from './features/legal/imprint/imprint.component';
import { PrivacyComponent } from './features/legal/privacy/privacy.component';

export const routes: Routes = [
  { path:'', component: PortfolioComponent },
  { path:'imprint', component: ImprintComponent },
  { path:'privacy', component: PrivacyComponent },
];