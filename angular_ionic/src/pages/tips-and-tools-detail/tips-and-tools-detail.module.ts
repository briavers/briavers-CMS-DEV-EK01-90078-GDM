import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TipsAndToolsDetailPage } from './tips-and-tools-detail';

@NgModule({
  declarations: [
    TipsAndToolsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TipsAndToolsDetailPage),
  ],
})
export class TipsAndToolsDetailPageModule {}
