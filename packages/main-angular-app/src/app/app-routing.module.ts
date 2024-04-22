import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubVueComponent } from './pages/sub-vue/sub-vue.component';
import { SubReactComponent } from './pages/sub-react/sub-react.component';

// 添加页面对应的路由
const routes: Routes = [
  {
    path: 'sub-vue',
    component: SubVueComponent,
  },
  {
    path: 'sub-react',
    component: SubReactComponent,
  },
  { path: '**', redirectTo: '/sub-vue' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
