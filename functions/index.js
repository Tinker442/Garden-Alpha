const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();


exports.hello = functions.https.onRequest((req, res) => {
  const id = JSON.stringify(new Date()); //temporary id. In future, ID's should be based on the date
  var object;
  var data = {};    
  try{ 
      //data format example: {"therm": 0.5,  "photo": 0.6, "moist": 0.5}
    object = JSON.parse(req.body); // parse request to json. needs error checking
    if( typeof object.photo === 'undefined') throw new Error('missing photo object');
    if( typeof object.moist === 'undefined') throw new Error('missing moist object');
    if( typeof object.therm === 'undefined') throw new Error('missing therm object');
    
    data = {
      brightness: object.photo,
      date: new Date(),
      humidity: object.moist,
      temperature: object.therm
    };
  }catch(e){
    data = {
      brightness: -1,
      date: new Date(),
      humidity: -1,
      temperature: -1,
      error: e.toString()
    }
  }
  db.collection("chipLog").doc(id).set(data);//overwrites doc with new info. In order to merge, add option ', {merge: true}' in set function 
  res.status(200).send(req.body);
});