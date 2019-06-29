window.onload = function(){
    n =  new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date").innerHTML = m + "/" + d + "/" + y;


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
        
        //Snapshot of the Database
        db.collection("schedule").doc("user-stored-schedule").get().then(doc => {
            let dataHold = doc.data();
            console.log(dataHold);
            loadForm(dataHold);

        }).then(function(){
            hideweeklyfieldset();
        });
        
}

function loadForm(d){
    document.getElementById("interval").value=d.interval;

    //weekly
    document.getElementById("sat").checked=d.sat;
    document.getElementById("mon").checked=d.mon;
    document.getElementById("tue").checked=d.tue;
    document.getElementById("wed").checked=d.wed;
    document.getElementById("thu").checked=d.thu;
    document.getElementById("fri").checked=d.fri;
    document.getElementById("sun").checked=d.sun;

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

