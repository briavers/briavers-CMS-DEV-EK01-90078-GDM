import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { PagesNewsFeedPage } from '../pages-news-feed/pages-news-feed';

/**
 * Generated class for the PagesQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-quiz',
  templateUrl: 'pages-quiz.html',
})
export class PagesQuizPage {
  @ViewChild('quizSlider') quizSlider: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public authService: ProvidersAuthServiceProvider) {}

  public types = {
    type_0: 'Sleep Lover',
    type_1: 'King / Queen of sleep',
    type_2: 'Panda',
    type_3: 'Screen Addict',
    type_4: 'Restless bat',
    type_5: 'Sleepyhead',
  }

  public result;

  public questions = [{
      question: 'Hoeveel tijd breng jij per nacht door in bed?',
      answers: Array({
        text: 'Mijn favoriete hoby! Meer dan 10 uur ',
        value: 'type_0'
      }, {
        text: 'Rond de 9 uur',
        value: 'type_1'
      }, {
        text: 'Gemiddeld een 6 tal uur, zolang er geen nieuwe netflix series zijn',
        value: 'type_2'
      }, {
        text: 'Toch wel een 7 a 8 uur',
        value: 'type_3'
      }, {
        text: 'Zeker meer dan 5 uur maar zelden langer dan 7 uur',
        value: 'type_4'
      }, {
        text: 'Bah slapen… gemiddeld minder dan 5 uur',
        value: 'type_5'
      }),
      answer: null
    },
    {
      question: 'Hoe lang duurt het ongeveer voordat je in slaap valt?',
      answers: Array({
        text: 'Een paar seconden... geef mij een slaapplek, en ik ben weg',
        value: 'type_0'
      }, {
        text: 'Binnen een 10 tal minuutjes ben ik vertrokken naar dromenland ',
        value: 'type_1'
      }, {
        text: 'Minimaal een kwartier, maar een half uur is zeker geen uitzondering op de regel!',
        value: 'type_2'
      }, {
        text: 'Zeker een half uur jammer genoeg ... ',
        value: 'type_5'
      }, {
        text: 'Meestal tussen een half uurtje en een uurtje eens men gsm weg is',
        value: 'type_3'
      }, {
        text: 'Ik lig iedere nacht meer dan een uur te woelen en te piekeren',
        value: 'type_4'
      }),
      answer: null
    },
    {
      question: 'Welke stelling past het beste bij jou?',
      answers: Array({
        text: 'S\'avond ga ik naar bed wanneer ik een beetje moe word',
        value: 'type_0'
      }, {
        text: 'Ik ga altijd op een vast tijdstip naar bed',
        value: 'type_1'
      }, {
        text: 'Ik ga altijd later naar bed dan de bedoeling was',
        value: 'type_2'
      }, {
        text: 'Ik ga naar bed wanneer ik niks beters meer te doen heb',
        value: 'type_3'
      }, {
        text: 'Wanneer ik moe ben, maar dit is altijd wel rond dezelfde tijd',
        value: 'type_4'
      }, {
        text: 'Ik word vaak s\'nachts op de bank wakker',
        value: 'type_5'
      }),
      answer: null
    },
    {
      question: 'Als ik overdag moe ben…',
      answers: Array({
        text: 'Doe ik even een dutje als ik de kans heb ',
        value: 'type_2'
      }, {
        text: 'Ga ik wat actiefs doen, of ga ik even naar buiten  ',
        value: 'type_0'
      }, {
        text: 'Ik ben overdag nooit moe ',
        value: 'type_1'
      }, {
        text: 'Daar hebben we toch koffie voor... ',
        value: 'type_4'
      }, {
        text: 'Neem ik even pauze met een spelletje of serie',
        value: 'type_3'
      }, {
        text: 'Dan verminderd men concentratie en ben ik snel afgeleid ',
        value: 'type_5'
      }),
      answer: null
    },
    {
      question: 'Als de wekker s’ochtends gaat dan…',
      answers: Array({
        text: 'Wekker? die heb ik niet, word altijd uit mijzelf wakker op hetzelfde tijdstip ',
        value: 'type_1'
      }, {
        text: 'Kom ik er direct uit... een nieuwe dag! ',
        value: 'type_0'
      }, {
        text: 'Dan snooze ik effe 1 keertje, en dan ben ik er klaar voor ',
        value: 'type_4'
      }, {
        text: 'Dan snooze ik een paar keer. Een kwartiertje extra kan toch geen kwaad',
        value: 'type_2'
      }, {
        text: 'Ah bah... instinctief druk ik de snooze knop alweer in',
        value: 'type_3'
      }, {
        text: 'Ik zet mijn wekker minimaal een half uur eerder om te kunnen snoozen  ',
        value: 'type_5'
      }),
      answer: null
    },

  ]

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesQuizPage');
    this.quizSlider.lockSwipes(true);
  }


  showPrevious() {
    this.quizSlider.lockSwipes(false);
    this.quizSlider.slidePrev(500);
    this.quizSlider.lockSwipes(true);
  }

  showNext() {
    this.quizSlider.lockSwipes(false);
    this.quizSlider.slideNext(500);
    this.quizSlider.lockSwipes(true);
  }

  submit() {
    console.log('the answers')
    console.log(this.questions)
    let tempResult = {
      type_0: 0,
      type_1: 0,
      type_2: 0,
      type_3: 0,
      type_4: 0,
      type_5: 0,
    };
    this.questions.forEach(element => {
      tempResult[element.answer] += 1
    });










    let keysSorted = Object.keys(tempResult).sort(function (a, b) {
      return tempResult[b] - tempResult[a]
    });

    this.result = [{
        key: keysSorted[0],
        value: (tempResult[keysSorted[0]] / this.questions.length * 100)
      },
      {
        key: keysSorted[1],
        value: (tempResult[keysSorted[1]] / this.questions.length * 100)
      },
      {
        key: keysSorted[2],
        value: (tempResult[keysSorted[2]] / this.questions.length * 100)
      },
      {
        key: keysSorted[3],
        value: (tempResult[keysSorted[3]] / this.questions.length * 100)
      },
      {
        key: keysSorted[4],
        value: (tempResult[keysSorted[4]] / this.questions.length * 100)
      },
      {
        key: keysSorted[5],
        value: (tempResult[keysSorted[5]] / this.questions.length * 100)
      },

    ]


    console.log(this.result);
    this.quizSlider.lockSwipes(false);
    this.quizSlider.slideNext(500);
    this.quizSlider.lockSwipes(true);
  }

  addToProfile(key){
    this.authService.updateSleepType(key).then((result) => {
      console.log('result')
      console.log(result)
      this.navCtrl.setRoot(PagesNewsFeedPage)
    }).catch((err) => {
      console.log(err)
      let alert = this.alertCtrl.create({
        title: 'Oeps',
        subTitle: 'Er ging iets mis. Je kan dit altijd zelf aanpassen in je profiel',
        buttons: ['Oké']
      });

      alert.present();

    });

  }
  navigateToNewsFeed(){
    this.navCtrl.setRoot(PagesNewsFeedPage)
  }


}
