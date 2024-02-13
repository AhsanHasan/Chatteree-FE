import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'onboarding',
    children: [
      {
        path: 'verify-account',
        loadChildren: () => import('../app/pages/onboarding/verify-account/verify-account.module').then(m => m.VerifyAccountModule)
      },
      {
        path: 'set-username',
        loadChildren: () => import('../app/pages/onboarding/set-username/set-username.module').then(m => m.SetUsernameModule)
      },
      {
        path: 'image-upload',
        loadChildren: () => import('../app/pages/onboarding/image-upload/image-upload.module').then(m => m.ImageUploadModule)
      }
    ]
  },
  {
    path: 'chat',
    loadChildren: () => import('../app/pages/chat/chat.module').then(m => m.ChatModule),
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
