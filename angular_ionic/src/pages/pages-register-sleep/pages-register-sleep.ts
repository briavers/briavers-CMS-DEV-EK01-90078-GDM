import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { PagesSleepPage } from '../pages-sleep/pages-sleep';

/**
 * Generated class for the PagesRegisterSleepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-register-sleep',
  templateUrl: 'pages-register-sleep.html',
})
export class PagesRegisterSleepPage {

  registerSleepForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public httpCall: ProvidersHttpHttpProvider) {
    this.registerSleepForm = formBuilder.group({
      bed_time: ['', Validators.required],
      wake_time: ['', Validators.required],
      sleep_depth: ['', Validators.required],
      slept_out: ['', Validators.required],
      sleep_date: ['', Validators.required],
      status: ['publish'],
      date: [''],
      sleep_meta_box_nonce: ['sleep']
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesRegisterSleepPage');
  }

  submitSleep() {
    if (this.registerSleepForm.status === "VALID") {
      this.registerSleepForm.controls['date'].setValue(this.registerSleepForm.value.sleep_date + ' ' + this.registerSleepForm.value.bed_time + ':00');
      this.httpCall.postSleep(this.registerSleepForm).then((result) => {
        console.log('result')
        console.log(result)
        if (result.status == 201) {
          this.navCtrl.setRoot(PagesSleepPage);
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
    } else {
      let alert = this.alertCtrl.create({
        title: 'vul alle velden in',
        subTitle: 'gelieve alle velden in te vullen',
        buttons: ['Oké']
      });
      alert.present();
    }
  }

}
