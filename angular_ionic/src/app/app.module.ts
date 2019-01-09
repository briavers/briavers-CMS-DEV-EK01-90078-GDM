import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http'; 

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PagesNewsFeedPage } from '../pages/pages-news-feed/pages-news-feed';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProvidersHttpHttpProvider } from '../providers/providers-http-http/providers-http-http';
import { ProvidersLoginProvider } from '../providers/providers-login/providers-login';
import { ProvidersAuthServiceProvider } from '../providers/providers-auth-service/providers-auth-service';
import { PagesRegisterPage } from '../pages/pages-register/pages-register';
import { PagesTipsAndToolsPage } from '../pages/pages-tips-and-tools/pages-tips-and-tools';
import { PagesImageContestPage } from '../pages/pages-image-contest/pages-image-contest';
import { TipsAndToolsDetailPage } from '../pages/tips-and-tools-detail/tips-and-tools-detail';
import { PagesFriendsPage } from '../pages/pages-friends/pages-friends';
import { PagesFriendsDetailPage } from '../pages/pages-friends-detail/pages-friends-detail';
import { PagesQuizPage } from '../pages/pages-quiz/pages-quiz';
import { PagesSleepPage } from '../pages/pages-sleep/pages-sleep';
import { PagesRegisterSleepPage } from '../pages/pages-register-sleep/pages-register-sleep';
import { PagesSoundsPage } from '../pages/pages-sounds/pages-sounds';
import { PagesYourImagesPage } from '../pages/pages-your-images/pages-your-images';
import { PagesProfilePage } from '../pages/pages-profile/pages-profile';
import { Geolocation } from '@ionic-native/geolocation';
import { ChartsModule } from 'ng2-charts';
import { FileOpener } from '@ionic-native/file-opener';
import { Transfer } from '@ionic-native/transfer';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PagesNewsFeedPage,
    PagesRegisterPage,
    PagesTipsAndToolsPage,
    PagesImageContestPage,
    TipsAndToolsDetailPage,
    
    PagesFriendsPage,
    PagesFriendsDetailPage,
    PagesQuizPage,
    PagesSleepPage,
    PagesRegisterSleepPage,
    PagesSoundsPage,
    PagesYourImagesPage,
    PagesProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartsModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PagesNewsFeedPage,
    PagesRegisterPage,
    PagesTipsAndToolsPage,
    PagesImageContestPage,
    TipsAndToolsDetailPage,
    PagesFriendsPage,
    PagesFriendsDetailPage,
    PagesQuizPage,
    PagesSleepPage,
    PagesRegisterSleepPage,
    PagesSoundsPage,
    PagesYourImagesPage,
    PagesProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProvidersHttpHttpProvider,
    ProvidersLoginProvider,
    ProvidersAuthServiceProvider,
    Geolocation,
    FileOpener,
    Transfer
    
  ]
})
export class AppModule {}
