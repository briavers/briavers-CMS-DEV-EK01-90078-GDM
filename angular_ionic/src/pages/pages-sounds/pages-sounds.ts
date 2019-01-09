import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the PagesSoundsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface CountdownTimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
}



@IonicPage()
@Component({
  selector: 'page-pages-sounds',
  templateUrl: 'pages-sounds.html',
})



export class PagesSoundsPage {
  timer: CountdownTimer;
  
  
  public timeInSeconds;
  public sounds = [{
      "title": 'Rivier',
      "link": '../../assets/sounds//creek.mp3',
      "state": 'paused'
    },
    {
      "title": 'Oceaan',
      "link": '../../assets/sounds/ocean_waves.mp3',
      "state": 'paused'
    },
    {
      "title": 'Wind',
      "link": '../../assets/sounds/wind _in_tree_folliage.mp3',
      "state": 'paused'
    },
    {
      "title": 'Vogels',
      "link": `../../assets/sounds/birds.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Waterval',
      "link": `../../assets/sounds/waterfall.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Regen',
      "link": `../../assets/sounds/rain.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Regen en Onweer',
      "link": `../../assets/sounds/rain_and_thunder.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Grootvaders Klok',
      "link": `../../assets/sounds/grandfathers_clock.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Spinnende Kat',
      "link": `../../assets/sounds/cat_spinngn.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Trein',
      "link": `../../assets/sounds/train.mp3`,
      "state": 'paused'
    },
    {
      "title": 'Kampvuur',
      "link": `../../assets/sounds/campfire.mp3`,
      "state": 'paused'
    },
  ]

  public activeSounds = [];
  public activeSoundsEditing = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesSoundsPage');
    this.initTimer();
  }

  soundPressed(sound) {
    if (this.activeSounds.indexOf(sound.title) === -1) {
      let name = sound.title
      name = new Audio(sound.link);
      name.id = sound.title;
      this.activeSoundsEditing.push(name);
      name.play();
      name.loop = true;
      this.activeSounds.push(sound.title)
      sound.state = 'playing'

      document.getElementById(sound.title).setAttribute('class', 'soundItem active item item-block item-md');




    } else {
      let name;
      this.activeSoundsEditing.forEach(element => {
        if (element.id === sound.title) {
          name = element
        }
      });
      name.loop = false;
      name.pause();
      this.activeSounds = this.activeSounds.filter(item => item !== sound.title);
      sound.state = 'paused'
      document.getElementById(sound.title).setAttribute('class', 'soundItem item item-block item-md"');
    }
  }

  getColor(status) {
    if (status == 'playing') {
      return 'active'
    } else {
      return ''
    }
  }










  hasFinished() {
    return this.timer.hasFinished;
  }

  initTimer() {
    if (!this.timeInSeconds) { this.timeInSeconds = 0; }

    this.timer = <CountdownTimer>{
      seconds: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: this.timeInSeconds
    };

    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
  }

  startTimer() {
    console.log('starting timer')
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) { return; }
      this.timer.secondsRemaining--;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.timer.hasFinished = true;
        this.stopMusic()
      }
    }, 1000);
  }

  stopMusic(){
    this.activeSoundsEditing.forEach(element => {
      element.loop = false;
      element.pause();
      this.activeSounds = [];
      document.getElementById(element.id).setAttribute('class', 'soundItem item item-block item-md"');
    });
  }


  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }


  setTimer(){
    let prompt = this.alertCtrl.create({
      title: 'Timer',
      message: "Hoe lang wil je de muziek laten spelen",
      inputs: [
        {
          name: 'time',
          placeholder: '00:00',
          type: 'time'
        },
      ],
      buttons: [
        {
          text: 'Start de klok',
          handler: data => {
            console.log('Saved clicked');
            console.log(data);
              
            let tempTime = data.time.split(":")
            console.log(tempTime)
            console.log(parseInt(tempTime[0]))
            
            this.timeInSeconds = ((parseInt(tempTime[0]) * 60) + (parseInt(tempTime[1])))
            console.log(this.timeInSeconds)
            this.initTimer();
            this.startTimer();
          }
        }
      ]
    });
    prompt.present();
  }

}
