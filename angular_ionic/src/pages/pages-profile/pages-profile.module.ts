import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesProfilePage } from './pages-profile';

@NgModule({
  declarations: [
    PagesProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PagesProfilePage),
  ],
})
export class PagesProfilePageModule {}
