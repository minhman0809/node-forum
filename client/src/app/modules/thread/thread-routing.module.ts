import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThreadComponent } from './pages/thread/thread.component';
import { ThreadDetailComponent } from './pages/thread-detail/thread-detail.component';
import { ThreadCreateComponent } from './pages/thread-create/thread-create.component';
import { AuthenticationGuard } from '../../core/guards/authentication/authentication.guard';
import { ErrorComponent } from '../../core/error/error.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ThreadComponent
      },
      {
        path: 'create',
        component: ThreadCreateComponent,
        pathMatch: 'full',
        canActivate: [AuthenticationGuard],
      },
      {
        path: ':channel',
        children: [
          {
            path: ':id',
            component: ThreadDetailComponent
          }
        ]
      },
      { path: '**', component: ErrorComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreadRoutingModule { }

