import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import * as firebase from "firebase";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  firebaseDbref: any;
  searchTerm: string;
  userData = {
    'contact': '',
    'name': '',
    'car_no': ''
  };
  postData: any;
  dbCarRefPath = '/user_data/skrm/car_list/';
  serverMessage = 'Data added successfully';
  showSnackbar: boolean = false;

  constructor(public navCtrl: NavController, private toaster: Toast) {
    this.firebaseDbref = firebase.apps[0].database();
    this.intializePostData();
  }

  intializePostData() {
    this.postData = {
      'contact': '',
      'name': '',
      'car_no': ''
    };
  }

  getUserData() {
    if (!this.searchTerm) {
      this.toaster.show('Car No is required', '2000', 'center').subscribe(toast => {
        console.log(toast);
      });
      return;
    }
    const searchTerm = this.dbCarRefPath + this.convertToUpperCase(this.searchTerm);
    this.firebaseDbref.ref(searchTerm)
      .once('value')
      .then((snapshot) => {
        if (snapshot.val()) {
          this.userData = snapshot.val();
          this.userData.contact = '+91' + this.userData.contact;
        }
      });
  }

  addUser() {
    if (!(this.postData.car_no || this.postData.contact)) {
      this.toaster.show('Car No and Contact are required', '2000', 'center').subscribe((toast) => {
        console.log(toast);
      })
      return;
    }
    this.postData.car_no = this.convertToUpperCase(this.postData.car_no);
    this.firebaseDbref.ref(this.dbCarRefPath + this.postData.car_no).set(this.postData).then(this.intializePostData());
    this.toaster.show('Data Added', '2000', 'center').subscribe((toast) => {
      console.log(toast);
    })
  }

  convertToUpperCase(carNo) {
    return carNo.toUpperCase();
  }

}