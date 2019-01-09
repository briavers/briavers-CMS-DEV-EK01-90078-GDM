import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesFriendsDetailPage } from './pages-friends-detail';

@NgModule({
  declarations: [
    PagesFriendsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesFriendsDetailPage),
  ],
})
export class PagesFriendsDetailPageModule {}
