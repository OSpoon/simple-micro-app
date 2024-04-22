import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SubVueComponent } from './pages/sub-vue/sub-vue.component';
import { SubReactComponent } from './pages/sub-react/sub-react.component';

@NgModule({
  declarations: [
    AppComponent,
    // 添加新页面的组件声明
    SubVueComponent,
    SubReactComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
