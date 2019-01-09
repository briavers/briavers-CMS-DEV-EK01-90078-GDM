import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-pages-your-images',
  templateUrl: 'pages-your-images.html',
})
export class PagesYourImagesPage implements OnInit {
  public images;
  public registerImageForm: FormGroup;
  public imageURI: any;
  public selectedFile: File;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpCall: ProvidersHttpHttpProvider, public authService: ProvidersAuthServiceProvider, public alertCtrl: AlertController, public formBuilder: FormBuilder) {

    this.registerImageForm = formBuilder.group({
      title: ['', Validators.required],
      file: [null, Validators.required],
      // post : [13222]
    })
  }


  ngOnInit() {
    let that = this
    this.getData(that);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesYourImagesPage');
  }



  getData(that) {
    let id = this.authService.getId()
    this.httpCall.getOwnImages(id)
      .then(function (response) {
        // handle success
        console.log(response);
        that.images = response.data
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

  }
  requestRemove(image) {

    let alert = this.alertCtrl.create({
      title: 'weet je zeker dat je deze foto wilt verwijderen',
      subTitle: image.post_title + 'zal verwijderd worden samen met alle likes ervan',
      buttons: [{
          text: 'neen',
          role: 'cancel'
        },
        {
          text: 'Ja ik wil ' + image.post_title + ' graag verwijderen',
          handler: () => {
            this.httpCall.deleteImage(image.ID, image.imageId).then((result) => {
              console.log('result')
              console.log(result)
              if (result.status == 200 || result.status == 204) {
                this.navCtrl.setRoot(PagesYourImagesPage);
              }
            }).catch((err) => {
              console.log(err)
              let alert = this.alertCtrl.create({
                title: 'Woops',
                subTitle: 'Er ging iets mis, probeer later nog eens',
                buttons: ['Oké']
              });
              alert.present();
            });
          }
        }
      ]
    });
    alert.present();
  }


  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  submitPicture(formdata) {

    this.httpCall.postImageContestEntry(this.registerImageForm.value, this.selectedFile).subscribe((event: any) => {
      if (event.id == null) {
        let alert = this.alertCtrl.create({
          title: 'Woops',
          subTitle: 'Er ging iets mis bij het uploaden, probeer later nog eens',
          buttons: ['Oké']
        });
        alert.present();
      } else {
        this.httpCall.imageContestPost(this.registerImageForm.value, event.id).then((result) => {
          console.log('result')
          console.log(result)
          if (result.status == 201) {
            this.navCtrl.setRoot(PagesYourImagesPage);
          }
        }).catch((err) => {
          console.log(err)
          let alert = this.alertCtrl.create({
            title: 'Woops',
            subTitle: 'Er ging iets mis, probeer later nog eens',
            buttons: ['Oké']
          });
          alert.present();
        });

      }
    });
  }
}