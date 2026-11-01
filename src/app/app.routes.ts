import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { Admin } from './components/admin/admin';
import { Login } from './components/login/login';
import { About } from './components/about/about';
import { Gallery } from './components/gallery/gallery';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'main', redirectTo: '', pathMatch: 'full' },
    { path: 'main', component: Main },
    { path: 'admin', component: Admin, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'about', component: About },
    { path: 'gallery', component: Gallery },
    { path: '**', redirectTo: '', pathMatch: 'full' }

];
