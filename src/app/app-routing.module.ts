import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';

// 未認証のユーザーのリダイレクト先を設定
const redirectUnauthorized = () => redirectUnauthorizedTo(['/']);
// 認証済みのユーザーのリダイレクト先を設定
const redirectLoggedIn = () => redirectLoggedInTo(['poker/list']);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedIn}
  },
  {
    path: 'poker',
    loadChildren: () => import('./poker/poker.module').then( m => m.PokerModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorized},
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
