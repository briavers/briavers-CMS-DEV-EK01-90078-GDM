import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { HomePage } from '../home/home';
import { TipsAndToolsDetailPage } from '../tips-and-tools-detail/tips-and-tools-detail';

/**
 * Generated class for the PagesNewsFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-news-feed',
  templateUrl: 'pages-news-feed.html',
})
export class PagesNewsFeedPage implements OnInit {
  public newsFeed;
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpCall: ProvidersHttpHttpProvider, public authService: ProvidersAuthServiceProvider, public alertCtrl: AlertController) {}


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
    console.log('requesting me')
    let id = this.authService.getId()
    if (id === false) {
      this.navCtrl.setRoot(HomePage)
    }
    this.httpCall.getNewsFeed(id)
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

  isItLiked(item) {

    let me = this.authService.getId()
    let doesIt = item.likedBy.includes(me)
    if (doesIt) {
      return true
    } else {
      return false
    }
  }
  likeIt(item) {
    let me = this.authService.getId()
    if (this.isItLiked(item)) {
      console.log('i unlike this');
      item.likedBy = item.likedBy.filter(item => item !== me)
      console.log(item.likedBy)
    } else {
      if (typeof item.likedBy === 'string') {

        item.likedBy = [me]
        console.log(item.likedBy)
      } else {
        item.likedBy.push(me)
        console.log(item.likedBy)
      }
    }
    let that = this
    this.httpCall.putLike(item.ID, me).then(function (response) {})
      .catch(function (error) {
        // handle error
        console.log(error);
        let alert = that.alertCtrl.create({
          title: 'ooeps',
          subTitle: 'Er is iets mis gelopen, probeer later nog eens',
          buttons: ['Oké']
        });
        alert.present();
      })
  }
}
