import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { HomePage } from '../home/home';
import { TipsAndToolsDetailPage } from '../tips-and-tools-detail/tips-and-tools-detail';

/**
 * Generated class for the PagesTipsAndToolsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-tips-and-tools',
  templateUrl: 'pages-tips-and-tools.html',
})
export class PagesTipsAndToolsPage {
  public newsFeed;
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpCall: ProvidersHttpHttpProvider, public authService: ProvidersAuthServiceProvider) {}


  ngOnInit() {
    let that = this
    this.getData(that);
  }


  ionViewCanEnter() {
    if (this.authService.authenticated()) {

    } else {
      this.navCtrl.setRoot(HomePage)
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesNewsFeedPage');


  }


  getData(that) {
    this.httpCall.getTipsFeed()
      .then(function (response) {
        // handle success
        console.log(response);
        that.newsFeed = response.data
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

  }


  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(TipsAndToolsDetailPage, {
      item: item
    });
  }


}