import firebase from 'firebase';
  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyDx3zXrXm4vTJxd9-ROOf4lLtdVIcugwe0",
    authDomain: "test-742c5.firebaseapp.com",
    databaseURL: "https://test-742c5.firebaseio.com",
    projectId: "test-742c5",
    storageBucket: "test-742c5.appspot.com",
    messagingSenderId: "629550931392"
  };
  const fire = firebase.initializeApp(config);

export default fire;