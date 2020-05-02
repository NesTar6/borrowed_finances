import * as firebase from 'firebase'
require("firebase/firestore");

var config = {
    apiKey: "AIzaSyA4ZlPuMhFcGHX7Nb4_smJdKXi6NH-wkBc",
    authDomain: "finances-37e16.firebaseapp.com",
    databaseURL: "https://finances-37e16.firebaseio.com",
    projectId: "finances-37e16",
    storageBucket: "finances-37e16.appspot.com",
    messagingSenderId: "128303613074",
    appId: "1:128303613074:web:afcfb34ddfda00489a524b",
    measurementId: "G-1G32CCBLLX"
 };

firebase.initializeApp(config)

const auth = firebase.auth();
const firestore = firebase.firestore()

export {
  auth, firestore
}


