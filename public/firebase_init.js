//configure firebase app rules
var firebaseConfig = {
    apiKey: "AIzaSyBr5PUPdNMvShPOOw6w4JXSxdzG0H9jDGw",
    authDomain: "garden-alpha.firebaseapp.com",
    databaseURL: "https://garden-alpha.firebaseio.com",
    projectId: "garden-alpha",
    storageBucket: "garden-alpha.appspot.com",
    messagingSenderId: "1069796650629",
    appId: "1:1069796650629:web:e245464aec8dedae"
    };
  //Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();