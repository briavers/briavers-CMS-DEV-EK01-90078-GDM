import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import leaflet from 'leaflet';
import { PagesFriendsDetailPage } from '../pages-friends-detail/pages-friends-detail';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
/**
 * Generated class for the PagesFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-friends',
  templateUrl: 'pages-friends.html',
})
export class PagesFriendsPage {
  public friends;
  public pendingFriends;
  public friendRequests;
  @ViewChild('map') mapcontainer: ElementRef

  public bedIcon = leaflet.icon({
    iconUrl: '../../assets/icon/bed.png',

    iconSize: [32, 32],
    iconAnchor: [22, 22],
    popupAnchor: [-3, -30]
  });


  friendRequestsForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpCall: ProvidersHttpHttpProvider, public authService: ProvidersAuthServiceProvider, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.friendRequestsForm = formBuilder.group({
      email: ['', Validators.required],
      type: [''],
    })

  }


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
    this.httpCall.getFriends(id)
      .then(function (response) {
        // handle success
        console.log(response);
        that.friends = response.data.friends
        that.pendingFriends = response.data.pendingFriends
        that.friendRequests = response.data.friendRequests

        console.log(that.friends);
        that.loadMap();

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

  }

  loadMap() {
    this.mapcontainer = leaflet.map("map").setView([51.054884, 3.72385], 13);
    leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiYnJpYXZlcnMiLCJhIjoiY2puNXNzOXd5MDVkNjNxcmZzbXM2NWczdSJ9.lYYkiWEQnJ4zH7KwDe9Q5A'
    }).addTo(this.mapcontainer);

    this.friends.forEach(element => {
      if (element.home_lat !== "" && element.home_long !== "" && element.home_lat !== null && element.home_long !== null) {
        let marker = leaflet.marker([element.home_lat, element.home_long], {
          icon: this.bedIcon
        }).addTo(this.mapcontainer);
        marker.bindPopup(`${element.display_name}`);
      }
    });
  }

  itemTapped(event, friend) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(PagesFriendsDetailPage, {
      friend: friend
    });
  }

  sendFriendRequest(formdata) {
    let id = this.authService.getId()
    console.log(formdata)
    this.friendRequestsForm.controls['type'].setValue(formdata)
    this.httpCall.friendRequest(this.friendRequestsForm, id).then((result) => {
      console.log('result')
      console.log(result)
      this.navCtrl.setRoot(PagesFriendsPage);
    }).catch((err) => {
      console.log(err)
      let alert = this.alertCtrl.create({
        title: 'Woops',
        subTitle: err,
        buttons: ['Oké']
      });
      alert.present();
    });
  }
  reactFriendRequest(formdata, user) {
    let id = this.authService.getId()
    console.log(formdata)
    this.friendRequestsForm.controls['type'].setValue(formdata)
    this.friendRequestsForm.controls['email'].setValue(user)
    this.httpCall.friendRequest(this.friendRequestsForm, id).then((result) => {
      console.log('result')
      console.log(result)
      this.navCtrl.setRoot(PagesFriendsPage)
    }).catch((err) => {
      console.log(err)
      let alert = this.alertCtrl.create({
        title: 'Woops',
        subTitle: err,
        buttons: ['Oké']
      });
      alert.present();
    });
  }







  acceptRequest(friend) {
    let alert = this.alertCtrl.create({
      title: 'wil je ' + friend.display_name + ' toevoegen als vriend?',
      buttons: [{
          text: 'weet ik nog niet',
          role: 'cancel'
        },
        {
          text: 'Ja ik wil ' + friend.display_name + ' graag toevoegen',
          handler: () => {
            this.reactFriendRequest('acceptRequest', friend.user_email)
          }
        },
        {
          text: 'Neen, ik wil dit verzoek verwijderen',
          handler: () => {
            this.reactFriendRequest('removeRequest', friend.user_email)
          }
        }
      ]
    });
    alert.present();
  }

  removeFriend(friend) {
    let alert = this.alertCtrl.create({
      title: 'wil je ' + friend.display_name + ' verwijderen als vriend?',
      buttons: [{
          text: 'neen',
          role: 'cancel'
        },
        {
          text: 'Ja ik wil ' + friend.display_name + ' verwijderen',
          handler: () => {
            this.reactFriendRequest('removeFriend', friend.user_email)
          }
        },
      ]
    });
    alert.present();
  }
  removeFriendRequest(friend) {
    let alert = this.alertCtrl.create({
      title: 'wil je het verzoek naar ' + friend.display_name + ' verwijderen?',
      buttons: [{
          text: 'neen',
          role: 'cancel'
        },
        {
          text: 'Ja ik wil ' + friend.display_name + ' verwijderen',
          handler: () => {
            this.reactFriendRequest('removeFriendRequest', friend.user_email)
          }
        },
      ]
    });
    alert.present();
  }

}
