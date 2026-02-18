
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent), title: 'Home' },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then(c => c.PortfolioComponent), title: 'Portfolio' },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(c => c.BlogComponent), title: 'Blog' },
  { path: 'blog/:id', loadComponent: () => import('./pages/blog-detail/blog-detail.component').then(c => c.BlogDetailComponent), title: 'Blog Post' },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent), title: 'Contact' },
  { path: 'login', loadComponent: () => import('./pages/admin-login/admin-login.component').then(c => c.AdminLoginComponent), title: 'Admin Login' },
  { 
    path: 'admin', 
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent), 
    canActivate: [authGuard],
    title: 'Admin Dashboard'
  },
  { path: '**', redirectTo: '' }
];
