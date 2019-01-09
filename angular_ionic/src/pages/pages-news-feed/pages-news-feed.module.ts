import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesNewsFeedPage } from './pages-news-feed';

@NgModule({
  declarations: [
    PagesNewsFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesNewsFeedPage),
  ],
})
export class PagesNewsFeedPageModule {}
