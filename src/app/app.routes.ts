import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { Admin } from './components/admin/admin';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: Main },
    { path: 'main', redirectTo: '', pathMatch: 'full' },
    { path: 'main', component: Main },
    { path: 'admin', component: Admin, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }

];
