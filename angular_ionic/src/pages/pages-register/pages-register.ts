import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Keyboard, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { PagesNewsFeedPage } from '../pages-news-feed/pages-news-feed';
//import leaflet from 'leaflet';
/**
 * Generated class for the PagesRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-register',
  templateUrl: 'pages-register.html',
})
export class PagesRegisterPage {
  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
  public createdId: number;
  public createdPassword: string;
  public createdUserName: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public keyboard: Keyboard, public authService: ProvidersAuthServiceProvider, public loadingCtrl: LoadingController) {


    this.slideOneForm = formBuilder.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });


    this.slideTwoForm = formBuilder.group({
      school: ['', Validators.required],
      hoursSleepANight: ['', Validators.required],
      hoursSleepANightDeadline: ['', Validators.required],
      typeSleeper: ['', Validators.required],
      bio: ['', Validators.required],
      latLong: false,
      lat: '',
      long: ''
    });
    this.authService.getRegisterToken()
  }



  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  next(value) {

    if (this.slideOneForm.status === "INVALID") {
      let alert = this.alertCtrl.create({
        title: 'vul alle velden in',
        subTitle: 'gelieve alle velden in te vullen',
        buttons: ['Oké']
      });
      alert.present();
      return;
    } else if (value.password !== value.passwordRepeat) {
      let alert = this.alertCtrl.create({
        title: 'foutieve wachtwoordherhaling',
        subTitle: 'het wachtwoord en herhaalde wachtwoord kwamen niet overeen',
        buttons: ['Oké']
      });
      alert.present();
      return;
    } else {

      console.log(value)
      this.authService.registerFirstForm(value).then((result) => {
        console.log('result')
        console.log(result)
        if (result.status == 201) {

          this.createdId = result.data.id
          this.createdUserName = value.userName
          this.createdPassword = value.password



          this.signupSlider.lockSwipes(false);
          this.signupSlider.slideNext();
          this.signupSlider.lockSwipes(true);
        }
      }).catch((err) => {
        console.log('err')
        console.log(err)
        console.log(err.code)
        console.log(err.response)

        let allertmesage = err.response.data.code == "rest_invalid_param" ? "het email adres is fout geformateerd" : err.response.data.message
        let alert = this.alertCtrl.create({
          title: 'Oeps',
          subTitle: allertmesage,
          buttons: ['Oké']
        });
        alert.present();

      });

    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesRegisterPage');

    this.signupSlider.lockSwipes(true);
  }

  submit(value) {
    if (value.school == '' || value.hoursSleepANight == '' || value.hoursSleepANightDeadline == '' || value.typeSleeper == '' || value.bio == '') {
      let alert = this.alertCtrl.create({
        title: 'vul alle nodige  velden in',
        subTitle: 'gelieve alle nodige velden in te vullen',
        buttons: ['Oké']
      });
      alert.present();
      return;
    } else {

      let that = this
      if (this.slideTwoForm.value.latLong) {
        navigator.geolocation.getCurrentPosition(function (location) {
          let loader = that.loadingCtrl.create({
            content: "Please wait...",
          });
          loader.present();
          
          that.slideTwoForm.patchValue({
            lat: location.coords.latitude,
            long: location.coords.longitude
          });

          console.log(value)
          that.authService.registerSecondForm(that.slideTwoForm.value, that.createdId).then((result) => {
            console.log('result')
            console.log(result)
            if (result.status == 201 || result.status == 200) {
              console.log('that.createdUserName');
              console.log(that.createdUserName);
              that.authService.doLogin({
                username: that.createdUserName,
                password: that.createdPassword
              }).then(function (response) {
                console.log('this was a succes')
                console.log(response)
                that.authService.setDate(response).then((result) => {
                  loader.dismiss()
                  that.navCtrl.setRoot(PagesNewsFeedPage)
                })
              }).catch((err) => {
                console.log(err)
              });
            }
          }).catch((err) => {
            console.log('err')
            console.log(err)
            console.log(err.code)
            console.log(err.response)

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
        console.log(value)
        that.authService.registerSecondForm(that.slideTwoForm.value, this.createdId).then((result) => {
          console.log('result')
          console.log(result)
          if (result.status == 201 || result.status == 200) {

            let loader = that.loadingCtrl.create({
              content: "Please wait...",
            });
            loader.present();
            console.log('that.createdUserName');
            console.log(that.createdUserName);
            that.authService.doLogin({
              username: that.createdUserName,
              password: that.createdPassword
            }).then(function (response) {
              console.log('this was a succes')
              console.log(response)
              that.authService.setDate(response).then((result) => {
                loader.dismiss()
                that.navCtrl.setRoot(PagesNewsFeedPage)
              })
            }).catch((err) => {
              console.log(err)
            });
          }
        }).catch((err) => {
          console.log('err')
          console.log(err)
          console.log(err.code)
          console.log(err.response)

          let allertmesage = err.response.data.code == "rest_invalid_param" ? "iets ging fout" : err.response.data.message
          let alert = that.alertCtrl.create({
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
