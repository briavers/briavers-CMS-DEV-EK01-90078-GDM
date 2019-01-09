import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';

/**
 * Generated class for the PagesImageContestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-image-contest',
  templateUrl: 'pages-image-contest.html',
})
export class PagesImageContestPage {
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
    this.httpCall.getImageFeed(id)
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
