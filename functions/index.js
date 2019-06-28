const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

/********************* Constants **************************/
//Used for behind the scenes calibrations
const chip_refresh_interval = 100; //army time notation how long between expected requests by the chip (100 -> 01:00 -> 1 hour)


/***********************************************/


exports.exchange = functions.https.onRequest((req, res) => {
  const id = JSON.stringify(new Date()); //temporary id. In future, ID's should be based on the date
  var sensor_data = createData(req);
  var chip_response = 0; //number of minutes to water. defaults to 0 = do not water.

  if('error' in sensor_data){
    console.log("error: "+sensor_data.error);
    res.status(400).send("Bad Request" + sensor_data.error);
  }else{
    db.collection("chipLog").doc(id).set(sensor_data); //overwrites doc with new info. In order to merge, add option ', {merge: true}' in set function 
    db.collection("schedule").doc("user-stored-schedule").get()
    .then(doc => {


      /* 
      
      
      currently only checks whether in correct time. In future, need to add day of the week check/interval check/thresholdcheck 
      
      
      */

      let data = doc.data();
      let now = new Date();
      let current_time = now.getHours() * 100 + now.getMinutes(); // gives current army time (eg. 2300 = 11:00pm)
      let schedule_time = parseStringToTime(data.time);         //gives time recorded in schedule in army time

      
      if(true){ //for testing purposes
      //if( current_time < schedule_time + chip_refresh_interval/2 &&  
      //    current_time > schedule_time - chip_refresh_interval/2){

            chip_response = data.duration;
        }

    }).then(()=>{
      console.log("chip response: "+ chip_response);
      res.status(200).send(chip_response.toString());
    });
    
  } 
});

function createData(req){
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
      error: e.toString()
    }
  }
  return data;
}

function parseStringToTime(string){

let res = string.split(":");
let out = Number(res[0]) * 100 + Number(res[1]);
return out;

}

exports.schedule = functions.https.onRequest((req, res) => {
  console.log(req.body);

  let data = {
    sat: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sun: false,
    interval: req.body.interval,
    duration: req.body.duration,
    time: req.body.time,
    temperature: req.body.temperature,
    lowMoisture: req.body.lowMoisture,
    highMoisture: req.body.highMoisture,

  }

  //if the options arent selected, these will not be in the request.
  if('saturday' in req.body)  data.sat = true;
  if('monday' in req.body)    data.mon = true;
  if('tuesday' in req.body)   data.tue = true;
  if('wednesday' in req.body) data.wed = true;
  if('thursday' in req.body)  data.thu = true;
  if('friday' in req.body)    data.fri = true;
  if('sunday' in req.body)    data.sun = true;

  //updates schedule
  db.collection("schedule").doc("user-stored-schedule").set(data);

  res.status(200).send(data);
});