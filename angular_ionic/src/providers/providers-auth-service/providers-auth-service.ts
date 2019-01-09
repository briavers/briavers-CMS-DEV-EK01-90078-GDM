//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Axios from 'axios';

/*
  Generated class for the ProvidersAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProvidersAuthServiceProvider {
  private token;
  public me;
  private baseUrl = 'https://2122be45.ngrok.io/wp-json'
  public registerToken;
  constructor() {}



  // Returns whether the user is currently authenticated
  // Could check if current token is still valid
  authenticated(): boolean {
    if (this.token !== undefined) {
      return true
    } else {
      return false
    }
  }
  doLogin(value) {
    return Axios.post(`${this.baseUrl}/jwt-auth/v1/token`, {
      username: value.username,
      password: value.password
    })
  }

  setDate(response) {
    let that = this;
    console.log('setting the responses')
    this.token = response.data.token;
    console.log(this.token)
    return Axios.get(`${this.baseUrl}/wp/v2/users/me`, {
      headers: {
        'Authorization': "Bearer " + this.token
      }
    }).then(function (response) {
      // handle success
      that.me = {
        'id': response.data.id,
        'name': response.data.name,
        'firstName': response.data.meta.firstName,
        'lastName': response.data.meta.lastName,
        'profilePicture': response.data.meta.profilePicture,
        'profilePictureId': response.data.meta.profilePictureId,
        'bio': response.data.acf.bio,
        'school': response.data.acf.school,
        'sleepGoalDate': response.data.acf.sleep_goal_date,
        'sleepGoalHours': response.data.acf.sleep_goal_hours,
        'typeSleeper': response.data.acf.type_sleeper,
        'homeLat': response.data.acf.home_lat,
        'homeLong': response.data.acf.home_long,
        'friends': response.data.acf.friends,
        'pendingFriends': response.data.acf.pending_friends,
        'friendRequests': response.data.acf.friend_requests,
      }
    })

  }


  rememberMe() {
    localStorage.setItem('sleepTight', this.token)
  }

  updateMeVariable() {
    let that = this
    return Axios.get(`${this.baseUrl}/wp/v2/users/me`, {
      headers: {
        'Authorization': "Bearer " + this.token
      }
    }).then(function (response) {
      // handle success
      that.me = {
        'id': response.data.id,
        'name': response.data.name,
        'firstName': response.data.meta.firstName,
        'lastName': response.data.meta.lastName,
        'profilePicture': response.data.meta.profilePicture,
        'profilePictureId': response.data.meta.profilePictureId,
        'bio': response.data.acf.bio,
        'school': response.data.acf.school,
        'sleepGoalDate': response.data.acf.sleep_goal_date,
        'sleepGoalHours': response.data.acf.sleep_goal_hours,
        'typeSleeper': response.data.acf.type_sleeper,
        'homeLat': response.data.acf.home_lat,
        'homeLong': response.data.acf.home_long,
        'friends': response.data.acf.friends,
        'pendingFriends': response.data.acf.pending_friends,
        'friendRequests': response.data.acf.friend_requests,
      }
    })
  }


  rememberedLogin() {
    let that = this;
    this.token = localStorage.getItem('sleepTight');
    console.log('inside remembered login');
    return Axios.get(`${this.baseUrl}/wp/v2/users/me`, {
      headers: {
        'Authorization': "Bearer " + this.token
      }
    }).then(function (response) {
      // handle success
      that.me = {
        'id': response.data.id,
        'name': response.data.name,
        'firstName': response.data.meta.firstName,
        'lastName': response.data.meta.lastName,
        'profilePicture': response.data.meta.profilePicture,
        'profilePictureId': response.data.meta.profilePictureId,
        'bio': response.data.acf.bio,
        'school': response.data.acf.school,
        'sleepGoalDate': response.data.acf.sleep_goal_date,
        'sleepGoalHours': response.data.acf.sleep_goal_hours,
        'typeSleeper': response.data.acf.type_sleeper,
        'homeLat': response.data.acf.home_lat,
        'homeLong': response.data.acf.home_long,
        'friends': response.data.acf.friends,
        'pendingFriends': response.data.acf.pending_friends,
        'friendRequests': response.data.acf.friend_requests,
      }
      console.log('inside inside remembered login');
      console.log(that.me);
    })

  }


  logout() {
    this.token = undefined;
    this.me = undefined;
    localStorage.removeItem('sleepTight')
  }

  getId() {
    if (this.me == undefined) {
      return false
    }
    return this.me.id;
  }

  getMe() {
    return this.me;
  }
  getToken() {
    return this.token;
  }
  getSleepGoal() {
    return this.me.sleepGoalHours
  }

  getRegisterToken() {
    let that = this;
    Axios.post(`${this.baseUrl}/jwt-auth/v1/token`, {

      username: 'JWT-AUTH',
      password: '2Q%tKwdj)B1oaNpCxbk3MCEC'

    }).then(function (response) {
      // handle success
      that.registerToken = response.data.token
    }).catch((err) => {
      console.log('err')
      console.log(err)
    });
  }

  registerFirstForm(formData) {
    return Axios.post(`${this.baseUrl}/wp/v2/users`, {
      username: formData.userName,
      password: formData.password,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName
    }, {
      headers: {
        'Authorization': "Bearer " + this.registerToken
      }
    })
  }
  registerSecondForm(formData, id) {
    return Axios.put(`${this.baseUrl}/acf/v3/users/${id}`, {
      fields: {
        'bio': formData.bio,
        'school': formData.school,
        'sleep_goal_date': formData.hoursSleepANightDeadline,
        'sleep_goal_hours': formData.hoursSleepANight,
        'type_sleeper': formData.typeSleeper,
        'home_lat': formData.lat,
        'home_long': formData.long,
        'profile_picture': '13324',
      }

    }, {
      headers: {
        'Authorization': "Bearer " + this.registerToken
      }
    })
  }

  updateProfile(formData, id) {
    console.log('formData and made it this far')
    console.log(formData)


    Axios.patch(`${this.baseUrl}/acf/v3/users/${id}`, {
      fields: {
        'bio': formData.bio,
        'school': formData.school,
        'sleep_goal_date': formData.hoursSleepANightDeadline,
        'sleep_goal_hours': formData.hoursSleepANight,
        'type_sleeper': formData.typeSleeper,
        'home_lat': formData.lat,
        'home_long': formData.long,
        'profile_picture': formData.file,
      }

    }, {
      headers: {
        'Authorization': "Bearer " + this.token
      }
    })

    return Axios.patch(`${this.baseUrl}/wp/v2/users/${id}`, {
      first_name: formData.firstName,
      last_name: formData.lastName,
    }, {
      headers: {
        'Authorization': "Bearer " + this.token
      }
    })

  }


  updateSleepType(key){
    
    return Axios.patch(`${this.baseUrl}/acf/v3/users/${this.me.id}`, {
      fields: {
        'type_sleeper': key
      }

    }, {
        headers: {
          'Authorization': "Bearer " + this.token
        }
      })
  }
}