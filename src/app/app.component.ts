import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor() {}
  ngOnInit(): void {
    firebase.initializeApp({
      apiKey: "AIzaSyAkP7MG6WOr9X1_qWyuMUE3snnjZcUsGdY",
      authDomain: "appalarmarobo.firebaseapp.com",
    }); 
  }  
}
