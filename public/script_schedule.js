window.onload = function(){
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date").innerHTML = m + "/" + d + "/" + y;


    //checks to see if user is signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            // var displayName = user.displayName;
            // var email = user.email;
            // var emailVerified = user.emailVerified;
            // var photoURL = user.photoURL;
            // var isAnonymous = user.isAnonymous;
            // var uid = user.uid;
            // var providerData = user.providerData;
            addToken();
            getDatabase();
            console.log(user);
        } else {
            console.log('user not signed in');
            // No user is signed in.
        }
        });
}

function addToken(){
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        document.getElementById("token").value = idToken;
      });
}

//loads schedule database
function getDatabase(){
    //Snapshot of the Database
    db.collection("schedule").doc("user-stored-schedule").get().then(doc => {
        let dataHold = doc.data();
        // console.log(dataHold);
        loadForm(dataHold);

    }).then(function(){
        hideweeklyfieldset();
    });
}
//populates form with stored schedule (in d)
function loadForm(d){
    document.getElementById("interval").value=d.interval;

    //weekly
    document.getElementById("sun").checked=d.sun;
    document.getElementById("mon").checked=d.mon;
    document.getElementById("tue").checked=d.tue;
    document.getElementById("wed").checked=d.wed;
    document.getElementById("thu").checked=d.thu;
    document.getElementById("fri").checked=d.fri;
    document.getElementById("sat").checked=d.sat;

    //timings
    document.getElementById("time").value=d.time;
    document.getElementById("duration").value=d.duration;

    //thresholds
    document.getElementById("temperature").value=d.temperature;
    document.getElementById("highMoisture").value=d.highMoisture;
    document.getElementById("lowMoisture").value=d.lowMoisture;
}



function disableSubmit(){
    let btns = document.getElementById("submit");
    
    btns.setAttribute("disabled","1");
    
}
function enableSubmit(){
    let btns = document.getElementById("submit");
    
    btns.removeAttribute("disabled");
}
function hideweeklyfieldset(){
    let weekDay = document.getElementsByClassName("week");

    if(document.getElementById("interval").value == "weekly"){
        for(let i=0;i<weekDay.length;i++){
            weekDay[i].removeAttribute("disabled");
        }
    }else{
        for(let i=0;i<weekDay.length;i++){
            weekDay[i].setAttribute("disabled","1");
        }
    }
}

