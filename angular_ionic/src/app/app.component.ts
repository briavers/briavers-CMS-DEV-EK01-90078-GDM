import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PagesNewsFeedPage } from '../pages/pages-news-feed/pages-news-feed';
import { ProvidersAuthServiceProvider } from '../providers/providers-auth-service/providers-auth-service';
import { PagesTipsAndToolsPage } from '../pages/pages-tips-and-tools/pages-tips-and-tools';
import { PagesImageContestPage } from '../pages/pages-image-contest/pages-image-contest';
import { PagesFriendsPage } from '../pages/pages-friends/pages-friends';
import { PagesSleepPage } from '../pages/pages-sleep/pages-sleep';
import { PagesYourImagesPage } from '../pages/pages-your-images/pages-your-images';
import { PagesSoundsPage } from '../pages/pages-sounds/pages-sounds';
import { PagesQuizPage } from '../pages/pages-quiz/pages-quiz';
import { PagesProfilePage } from '../pages/pages-profile/pages-profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public authService: ProvidersAuthServiceProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'News Feed', component: PagesNewsFeedPage },
      { title: 'Tips and tricks', component: PagesTipsAndToolsPage },
      { title: 'Foto Wedstrijd', component: PagesImageContestPage },
      { title: 'Friends', component: PagesFriendsPage },
      { title: 'Sleep Tracking', component: PagesSleepPage },
      { title: 'Jouw Foto\'s', component: PagesYourImagesPage },
      { title: 'Geluiden', component: PagesSoundsPage },
      { title: 'Ontdek welke slaper je bent', component: PagesQuizPage },
      { title: 'Pas je profiel aan', component: PagesProfilePage },


    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout(){
    this.nav.setRoot(HomePage)
    this.authService.logout()
  }
}
