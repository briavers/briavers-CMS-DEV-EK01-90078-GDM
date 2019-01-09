import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';

/**
 * Generated class for the PagesFriendsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-friends-detail',
  templateUrl: 'pages-friends-detail.html',
})
export class PagesFriendsDetailPage {
  friend: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: ProvidersAuthServiceProvider, public alertCtrl: AlertController, public httpCall: ProvidersHttpHttpProvider) {
    this.friend = navParams.get('friend');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TipsAndToolsDetailPage');
    console.log(this.friend);
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