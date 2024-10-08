import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { IsActiveGuard } from './guards/isActive.guard';
import { MobileDeviceGuard } from './guards/mobile-device.guard';
import { DesktopDeviceGuard } from './guards/desktop-device.guard';
import { IsCompletedProfileGuard } from './guards/is-profile-complete.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [GuestGuard],
    loadChildren: () => import('../app/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'onboarding',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'verify-account',
        loadChildren: () => import('../app/pages/onboarding/verify-account/verify-account.module').then(m => m.VerifyAccountModule)
      },
      {
        path: 'set-username',
        canActivate: [IsActiveGuard, IsCompletedProfileGuard],
        loadChildren: () => import('../app/pages/onboarding/set-username/set-username.module').then(m => m.SetUsernameModule)
      },
      {
        path: 'basic-information',
        canActivate: [IsActiveGuard, IsCompletedProfileGuard],
        loadChildren: () => import('../app/pages/onboarding/image-upload/image-upload.module').then(m => m.ImageUploadModule)
      }
    ]
  },
  {
    path: 'chat',
    canActivate: [MobileDeviceGuard, AuthGuard, IsActiveGuard],
    loadChildren: () => import('../app/pages/chat/chat.module').then(m => m.ChatModule),
  },
  {
    path: 'm-chat',
    canActivate: [DesktopDeviceGuard, AuthGuard, IsActiveGuard],
    loadChildren: () => import('../app/pages/mobile-chat/mobile-chat.module').then(m => m.MobileChatModule),
  },
  {
    path: '404',
    loadChildren: () => import('../app/pages/error-page/error-page.module').then(m => m.ErrorPageModule),
  },
  {
    path: 'transition',
    loadChildren: () => import('../app/pages/transition-page/transition-page.module').then(m => m.TransitionPageModule),
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
