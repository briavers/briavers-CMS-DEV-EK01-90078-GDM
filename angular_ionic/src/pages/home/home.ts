import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { PagesNewsFeedPage } from '../pages-news-feed/pages-news-feed';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagesRegisterPage } from '../pages-register/pages-register';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';

  constructor(public navCtrl: NavController, public authService: ProvidersAuthServiceProvider, public alertCtrl: AlertController, private fb: FormBuilder, public loadingCtrl: LoadingController) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
      rememberMe: [false]
    });
  }

  ngOnInit() {

    let loader = this.loadingCtrl.create({
      content: "checking login status",
    });
    loader.present();

    if (localStorage.getItem('sleepTight') !== null) {
      console.log('you should be remembered')

      let that = this
      this.authService.rememberedLogin().then(function (response) {
        console.log('this was a succes')
        console.log(response)
        that.navCtrl.setRoot(PagesNewsFeedPage)
      }).catch(function (error) {
        if (error) {
          console.log('this was a fail')
          console.log(error)
          let alert = that.alertCtrl.create({
            title: 'Log je nog eens in',
            subTitle: 'Het is te lang geleden dat je je hebt ingelogd. we willen zeker zijn dat je bent wie je zegt je bent',
            buttons: ['Oké']
          });
          alert.present();
        }
      });

    }
    loader.dismiss()
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }



  goToRegister() {
    this.navCtrl.push(PagesRegisterPage)
  }

  tryLogin(value) {
    let that = this



    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();



    this.authService.doLogin(value)
      .then(function (response) {
        console.log('this was a succes')
        console.log(response)
        let remembered = that.loginForm.value.rememberMe ? true : false;
        that.authService.setDate(response).then((result) => {
          if (remembered) {
            that.authService.rememberMe();
          }
          loader.dismiss()
          that.navCtrl.setRoot(PagesNewsFeedPage)

        }).catch((err) => {
          console.log(err)
        });



      })
      .catch(function (error) {
        if (error) {
          console.log('this was a fail')
          console.log(error)
          let alert = that.alertCtrl.create({
            title: 'Foute nickname of wachtwoord',
            subTitle: 'probeer opnieuw of registreer je',
            buttons: ['Oké']
          });
          loader.dismiss()
          alert.present();
        }
      });
  }
}
