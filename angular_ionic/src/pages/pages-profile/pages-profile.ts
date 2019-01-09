import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';

/**
 * Generated class for the PagesProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-profile',
  templateUrl: 'pages-profile.html',
})
export class PagesProfilePage {
  profileForm: FormGroup;
  public me;
  public selectedFile: File;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public authService: ProvidersAuthServiceProvider, private httpCall: ProvidersHttpHttpProvider, public loadingCtrl: LoadingController) {

    this.profileForm = formBuilder.group({


      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      school: ['', Validators.required],
      hoursSleepANight: ['', Validators.required],
      hoursSleepANightDeadline: ['', Validators.required],
      typeSleeper: ['', Validators.required],
      bio: ['', Validators.required],
      latLong: false,
      lat: '',
      long: '',
      file: '',
    })
  }

  ionViewDidLoad() {
    this.getData()
    console.log('ionViewDidLoad PagesProfilePage');
  }

  getData() {
    this.me = this.authService.getMe();

    console.log("this.me");
    console.log(this.me);
    console.log(this.me.sleepGoalDate);
    this.profileForm.patchValue({
      
      firstName: this.me.firstName,
      lastName: this.me.lastName,
      school: this.me.school,
      hoursSleepANight: this.me.sleepGoalHours,
      hoursSleepANightDeadline: this.me.sleepGoalDate,
      typeSleeper: this.me.typeSleeper.value,
      bio: this.me.bio,
    });
  }


  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  submit(value) {

    if (this.selectedFile !== undefined) {
      console.log('this.selectedfile is not null');
      console.log(this.selectedFile);

      this.httpCall.postProfileImage(this.selectedFile, this.me.profilePictureId).subscribe((event: any) => {

        if (event.id == null) {
          let alert = this.alertCtrl.create({
            title: 'Woops',
            subTitle: 'Er ging iets mis bij het uploaden, probeer later nog eens',
            buttons: ['Oké']
          });

          alert.present();
        } else {
          this.profileForm.controls['file'].setValue(event.id)
          console.log(value);
          let that = this
          if (this.profileForm.value.latLong) {
            console.log('we want the location')

            navigator.geolocation.getCurrentPosition(function (location) {

              console.log('were gona patch the value')
              console.log(location.coords.latitude)
              that.profileForm.patchValue({
                lat: location.coords.latitude,
                long: location.coords.longitude

              });
              console.log(that.profileForm)
              that.authService.updateProfile(that.profileForm.value, that.me.id).then((result) => {
                console.log('result')
                console.log(result)

                that.authService.updateMeVariable().then(() => {
                  that.navCtrl.setRoot(PagesProfilePage)
                })
              }).catch((err) => {
                console.log('err')
                console.log(err)
                let allertmesage = err.response.data.code == "rest_invalid_param" ? "iets ging fout" : err.response.data.message
                let alert = that.alertCtrl.create({
                  title: 'Oeps',
                  subTitle: allertmesage,
                  buttons: ['Oké']
                });

                alert.present();

              });
            })
          } else {
            this.authService.updateProfile(that.profileForm.value, this.me.id).then((result) => {
              console.log('result')
              console.log(result)

              that.authService.updateMeVariable().then(() => {
                that.navCtrl.setRoot(PagesProfilePage)
              })
            }).catch((err) => {
              console.log('err')
              console.log(err)
              let allertmesage = err.response.data.code == "rest_invalid_param" ? "iets ging fout" : err.response.data.message
              let alert = this.alertCtrl.create({
                title: 'Oeps',
                subTitle: allertmesage,
                buttons: ['Oké']
              });

              alert.present();
            });
          }
        }
      });
    } else {
      this.profileForm.controls['file'].setValue(this.me.profilePictureId)
      console.log(value);
      let that = this
      if (this.profileForm.value.latLong) {
        console.log('we want the location')
        navigator.geolocation.getCurrentPosition(function (location) {
          console.log('were gona patch the value')
          console.log(location.coords.latitude)
          that.profileForm.patchValue({
            lat: location.coords.latitude,
            long: location.coords.longitude

          });
          console.log(that.profileForm)
          that.authService.updateProfile(that.profileForm.value, that.me.id).then((result) => {
            console.log('result')
            console.log(result)

            that.authService.updateMeVariable().then(() => {
              that.navCtrl.setRoot(PagesProfilePage)
            })
          }).catch((err) => {
            console.log('err')
            console.log(err)
            let allertmesage = err.response.data.code == "rest_invalid_param" ? "iets ging fout" : err.response.data.message
            let alert = that.alertCtrl.create({
              title: 'Oeps',
              subTitle: allertmesage,
              buttons: ['Oké']
            });

            alert.present();

          });
        })
      } else {

        this.authService.updateProfile(this.profileForm.value, this.me.id).then((result) => {
          console.log('result')
          console.log(result)
          that.authService.updateMeVariable().then(() => {
            that.navCtrl.setRoot(PagesProfilePage)
          })
        }).catch((err) => {
          console.log('err')
          console.log(err)
          let allertmesage = err.response.data.code == "rest_invalid_param" ? "iets ging fout" : err.response.data.message
          let alert = this.alertCtrl.create({
            title: 'Oeps',
            subTitle: allertmesage,
            buttons: ['Oké']
          });

          alert.present();
        });
      }

    }




  }
}