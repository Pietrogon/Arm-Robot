import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCyW9pkKZRXv6Kt_4KCGYRb440oQQFIk2U",
  authDomain: "amr-robot.firebaseapp.com",
  projectId: "amr-robot",
  storageBucket: "amr-robot.appspot.com",
  messagingSenderId: "568930376675",
  appId: "1:568930376675:web:788263b0976f282384ded6"
})

export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
export const functions = firebaseApp.functions('southamerica-east1');
export const storage = firebaseApp.storage();
