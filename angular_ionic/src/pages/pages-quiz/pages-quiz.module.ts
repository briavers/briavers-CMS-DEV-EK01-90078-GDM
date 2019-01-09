import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesQuizPage } from './pages-quiz';

@NgModule({
  declarations: [
    PagesQuizPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesQuizPage),
  ],
})
export class PagesQuizPageModule {}
