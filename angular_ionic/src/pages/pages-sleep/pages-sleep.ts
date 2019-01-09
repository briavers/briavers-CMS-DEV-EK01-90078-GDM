import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PagesRegisterSleepPage } from '../pages-register-sleep/pages-register-sleep';
import { ProvidersAuthServiceProvider } from '../../providers/providers-auth-service/providers-auth-service';
import { ProvidersHttpHttpProvider } from '../../providers/providers-http-http/providers-http-http';
import { Chart, ChartOptions } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
/**
 * Generated class for the PagesSleepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-sleep',
  templateUrl: 'pages-sleep.html',
})
export class PagesSleepPage implements OnInit {
  public sleep
  public sleepGoal = this.authService.getSleepGoal()
  @ViewChild('barCanvas') barCanvas;
  public barChart: any;

  @ViewChild('lineCanvas') linecanvas;
  public lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpCall: ProvidersHttpHttpProvider, public authService: ProvidersAuthServiceProvider) {}
  setGraphData() {
    this.barChart.data.labels = []
    this.barChart.data.datasets[0].data = []

    this.sleep.lastWeek.forEach(element => {
      this.barChart.data.labels.unshift(element.metadata._sleep_date[0])

      let sleep = this.calculateSleep(element)
      this.barChart.data.datasets[0].data.unshift(sleep[0])
      let color = this.getColor(sleep[0]);
      this.barChart.data.datasets[0].backgroundColor.unshift(color)

      this.barChart.update();
    });




    this.sleep.lastMonth.forEach(element2 => {
      this.lineChart.data.labels.unshift(element2.metadata._sleep_date[0])

      let sleep2 = this.calculateSleep(element2)
      this.lineChart.data.datasets[0].data.unshift(sleep2[0])

      this.lineChart.update();
    });





    console.log(this.barChart.data.datasets[0].data)
    console.log(this.lineChart.data.datasets[0].data)
  }
  ngOnInit() {
    let that = this
    this.getData(that);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesSleepPage');
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: []
        }],
      },
      options: {
        legend: {
          display: false
        },
        tooltips: { enabled: false },
        hover: { mode: null },
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.sleepGoal,
            borderColor: 'rgb(245, 161, 77)',
            borderWidth: 4,
            label: {
              enabled: false,
              content: 'Test label'
            }
          }]
        } as ChartOptions,
        plugins: [ChartAnnotation]
      },

    });

    this.lineChart = new Chart(this.linecanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          borderColor : ['rgba(217,82,66,1)'],
          backgroundColor : ['rgba(0,0,0,0)'],
          
        }],
      },
      options: {
        legend: {
          display: false
        },
        tooltips: { enabled: false },
        hover: { mode: null },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.sleepGoal,
            borderColor: 'rgb(245, 161, 77)',
            borderWidth: 4,
            label: {
              enabled: false,
              content: 'Test label'
            }
          }]
        } as ChartOptions,
        plugins: [ChartAnnotation]
      },

    });

  }
  goToSleepRegister() {
    this.navCtrl.push(PagesRegisterSleepPage)
  }
  
  getColor(tempValue) {
    let value = tempValue / this.sleepGoal
    var hue = (((value) - 0.5) * 110).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  
  }
  
  getData(that) {
    console.log('requesting me')
    let id = this.authService.getId()
    this.httpCall.getSleep(id)
      .then(function (response) {
        // handle success
        console.log(response);
        that.sleep = response.data
  
        that.setGraphData()
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  
  }
  
  calculateSleep(data) {
    let bedTime = data.metadata._bed_time.toString();
    var bedTimeParts = bedTime.split(":");
    let bedTimeMili = (bedTimeParts[0] * (60000 * 60)) + (bedTimeParts[1] * 60000);
  
    let wakeTime = data.metadata._wake_time.toString();
    var wakeTimeParts = wakeTime.split(":");
    let wakeTimeMili = (wakeTimeParts[0] * (60000 * 60)) + (wakeTimeParts[1] * 60000);
  
    let timeDiffMili;
    if ((wakeTimeMili - bedTimeMili) < 0) {
      //bedtime was before 00u
      timeDiffMili = ((24 * 60 * 60 * 1000) - bedTimeMili) + wakeTimeMili;
    } else {
      //bedtime was after 00u 
      timeDiffMili = (wakeTimeMili - bedTimeMili);
    }
    console.log(timeDiffMili);
    let hours = (timeDiffMili / (1000 * 60 * 60)) % 24;
    return [hours, timeDiffMili]
  }
  
  transformTimeToString(time) {
  
    let minutes = time / (1000 * 60) % 60;
    let hours = time / (1000 * 60 * 60) % 24;
  
    let hoursAnswer = (hours < 10) ? "0" + hours : hours;
    let minutesAnswer = (minutes < 10) ? "0" + minutes : minutes;
    return (hoursAnswer + ':' + minutesAnswer);
  }
}
  