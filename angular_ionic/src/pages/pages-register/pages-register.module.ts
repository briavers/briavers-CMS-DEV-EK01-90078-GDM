import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesRegisterPage } from './pages-register';

@NgModule({
  declarations: [
    PagesRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesRegisterPage),
  ],
})
export class PagesRegisterPageModule {}
