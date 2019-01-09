
import { Injectable } from '@angular/core';
import axios from 'axios';
import Axios from 'axios';
import { ProvidersAuthServiceProvider } from '../providers-auth-service/providers-auth-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
/*
  Generated class for the ProvidersHttpHttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProvidersHttpHttpProvider {
  private baseUrl = 'https://cmsdevelopment.be/briavers/wp-json'
  constructor(public authService: ProvidersAuthServiceProvider, public http: HttpClient) {

  }

  getNewsFeed(userId) {
    return axios.get(`${this.baseUrl}/restNewsFeed/v1/user/${userId}`)
  }
  getTipsFeed() {
    return axios.get(`${this.baseUrl}/restTipsFeed/v1/tips`)
  }
  getImageFeed(userId) {
    return axios.get(`${this.baseUrl}/restImagesFriends/v1/user/${userId}`)
  }
  getFriends(userId) {
    return axios.get(`${this.baseUrl}/restFriends/v1/user/${userId}`)
  }
  getSleep(userId) {
    return axios.get(`${this.baseUrl}/restSleep/v1/author/${userId}`)
  }

  getOwnImages(userId) {
    return axios.get(`${this.baseUrl}/restImagesMe/v1/author/${userId}`)
  }


  postSleep(formData) {
    let token = this.authService.getToken();
    console.log(formData);
    return Axios.post(`${this.baseUrl}/wp/v2/rest_sleep`, formData.value, {
      headers: {
        'Authorization': "Bearer " + token
      }
    })
  }

  friendRequest(formData, userId) {
    let token = this.authService.getToken();
    console.log(formData);
    return Axios.post(`${this.baseUrl}/addFriends/v1/user/${userId}`, formData.value, {
      headers: {
        'Authorization': "Bearer " + token
      }
    })
  }

  putLike(id, me) {
    let token = this.authService.getToken();
    return Axios.post(`${this.baseUrl}/restLikeImage/v1/image`, {
      imageId: id,
      user: me
    }, {
      headers: {
        'Authorization': "Bearer " + token
      }
    })
  }

  postImageContestEntry(formData, file) {
    let token = this.authService.getToken();
    const fd = new FormData();
    fd.append('file', file, file.name);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    console.log('token')
    console.log(token)
    console.log('headers')
    console.log(httpOptions)
    return this.http.post(`${this.baseUrl}/wp/v2/media`, fd, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    })
  }
  postProfileImage(file, imageId) {
    let token = this.authService.getToken();
    const fd = new FormData();
    fd.append('file', file, file.name);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    console.log('token')
    console.log(token)
    console.log('headers')
    console.log(httpOptions)
    Axios.delete(`${this.baseUrl}/wp/v2/media/${imageId}?force=true`, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    })
    return this.http.post(`${this.baseUrl}/wp/v2/media`, fd, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    })
  }

  imageContestPost(formData, imageId) {
    let token = this.authService.getToken();
    return Axios.post(`${this.baseUrl}/wp/v2/imageContest`, {
      title: formData.title,
      status: 'pending',
      featured_media: imageId,
    }, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    })
  }

  deleteImage(contestId, imageId) {
    let token = this.authService.getToken();
    Axios.delete(`${this.baseUrl}/wp/v2/media/${imageId}?force=true`, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    })
    return Axios.delete(`${this.baseUrl}/wp/v2/imageContest/${contestId}?force=true`, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    })
  }


}
