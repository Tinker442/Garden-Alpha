var database = [];//GLOBAL VARIABLE FOR THE INCOMING DATA
//FORMAT {brightness: 98, date: n(timestamp), humidity: 79, temperature: 100}

//===========DATABASE==================================================/
//Firebase configuration
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
db.collection("chipLog").get().then(function(snapshot){//Then because async JS will load without data
  snapshot.docs.forEach(doc =>{
    let dataHold = doc.data();
    if(checkDataCorruption(dataHold)){//returns true for clear data
      dataHold.date = (dataHold.date).toDate();//converts firestore's timestamp to date format (I know right?)
      database.push(dataHold);//push object into database array
    }
  });
  drawChartAndTable(database);//call function to draw tables and charts after data has been received
}); 
//===========DATABASE==================================================/

//Calls chart and table's draw functions after data has been loaded
function drawChartAndTable(database){

  //================LINE CHART TEMPERATURE==========================================/
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(temperatureChart);
  window.onresize = temperatureChart;//Runs the function everytime window is resized, responsive (could be done diferently so it doesn't have to redraw the whole chart but as you can see it took me one line)

  function temperatureChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Soil Temp');
    data.addColumn({type: 'string', role: 'tooltip'});
  
    let holdRows = [];
    for(let i=0;i<database.length;i++){//creates rows
      holdRows.push([
        database[i].date,
        database[i].temperature,
        "Date: "+database[i].date.toDateString()+" "
        +database[i].date.toLocaleString('en-US', { hour: 'numeric', minute:'numeric' , hour12: true })
        +"\nSoil Temperature: "+database[i].temperature+" F°"
      ]);
    };

    data.addRows(holdRows);//sets rows

    var options = {
      hAxis: {
        title: 'Time(Date)'
      },
      vAxis: {
        title: 'Temperature(F°)'
      },
      colors: ['#dd5500'],
      series: {
              0: { lineWidth: 3 }
      },
    };

    var chart = new google.visualization.LineChart(document.getElementById('tempe_chart'));
    chart.draw(data, options);
  }
  //================LINE CHART TEMPERATURE==========================================/

  //================LINE CHART HUMIDITY==========================================/
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(humidityChart);
  window.onresize = humidityChart;//Runs the function everytime window is resized, responsive (could be done diferently so it doesn't have to redraw the whole chart but as you can see it took me one line)

  function humidityChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Soil Humid');
    data.addColumn({type: 'string', role: 'tooltip'});
  
    let holdRows = [];
    for(let i=0;i<database.length;i++){//creates rows
      holdRows.push([
        database[i].date,
        database[i].humidity,
        "Date: "+database[i].date.toDateString()+" "
        +database[i].date.toLocaleString('en-US', { hour: 'numeric', minute:'numeric' , hour12: true })
        +"\nSoil Humidity: "+database[i].humidity+"%"
      ]);
    };

    data.addRows(holdRows);//sets rows

    var options = {
      hAxis: {
        title: 'Time(Date)'
      },
      vAxis: {
        title: 'Humidity(%)'
      },
      colors: ['#0055dd'],
      series: {
              0: { lineWidth: 3 }
      },
    };

    var chart = new google.visualization.LineChart(document.getElementById('humid_chart'));
    chart.draw(data, options);
  }
  //================LINE CHART HUMIDITY==========================================/

    //================LINE CHART BRIGHTNESS==========================================/
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(brightnessChart);
    window.onresize = brightnessChart;//Runs the function everytime window is resized, responsive (could be done diferently so it doesn't have to redraw the whole chart but as you can see it took me one line)
  
    function brightnessChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('number', 'Bright ness');
      data.addColumn({type: 'string', role: 'tooltip'});
    
      let holdRows = [];
      for(let i=0;i<database.length;i++){//creates rows
        holdRows.push([
          database[i].date,
          database[i].brightness,
          "Date: "+database[i].date.toDateString()+" "
          +database[i].date.toLocaleString('en-US', { hour: 'numeric', minute:'numeric' , hour12: true })
          +"\nBrightness: "+database[i].brightness+"%"
        ]);
      };
  
      data.addRows(holdRows);//sets rows
  
      var options = {
        hAxis: {
          title: 'Time(Date)'
        },
        vAxis: {
          title: 'Brightness(%)'
        },
        colors: ['#aaee00'],
        series: {
                0: { lineWidth: 3 }
        },
      };
  
      var chart = new google.visualization.LineChart(document.getElementById('brigh_chart'));
      chart.draw(data, options);
    }
    //================LINE CHART BRIGHTNESS==========================================/

  //================DATA TABLE==========================================/
  google.charts.load('current', {'packages':['table']});
  google.charts.setOnLoadCallback(drawTable);

  function drawTable() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('string', 'Time');
    data.addColumn('number', 'Brightness');
    data.addColumn('number', 'Humidity');
    data.addColumn('number', 'Temperature');

    let holdRows = [];//this variable is local, don't worry about duplicates, don't use VAR though, that's global
    for(let i=0;i<database.length;i++){//creates rows
      holdRows.push([
        database[i].date,
        database[i].date.toLocaleString('en-US', { hour: 'numeric', minute:'numeric' , hour12: true }),
        database[i].brightness, 
        database[i].humidity,
        database[i].temperature
      ]);
    };
    data.addRows(holdRows);

    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
  }
  //================DATA TABLE==========================================/
  console.info(database);
}

function checkDataCorruption(obj){//checks the data for null/undefined values
  let checkCounter = 0;
  checkCounter += obj.brightness==null||undefined?0:1;
  checkCounter += obj.humidity==null||undefined?0:1;
  checkCounter += obj.temperature==null||undefined?0:1;
  checkCounter += obj.date==null||undefined?0:1;
  if (checkCounter < 4){
    return false;
  }else{
    return true;//if date is clean returns true
  }
}
