import firebase from 'firebase/app';
import 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyC4TeqRYkov4kQ_QTOLlSx39CbUpykRvco",
  authDomain: "m-city-ed042.firebaseapp.com",
  databaseURL: "https://m-city-ed042.firebaseio.com",
  projectId: "m-city-ed042",
  storageBucket: "m-city-ed042.appspot.com",
  messagingSenderId: "732161100964",
  appId: "1:732161100964:web:fe637488a478da5f"
};

firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');
const firebasePromotions = firebaseDB.ref('promotions');
const firebaseTeams = firebaseDB.ref('teams');
const firebasePlayers = firebaseDB.ref('players');

export {
  firebase,
  firebaseMatches,
  firebasePromotions,
  firebaseTeams,
  firebasePlayers,
  firebaseDB,

}