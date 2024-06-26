var database = [];//GLOBAL VARIABLE FOR THE INCOMING DATA
//FORMAT {brightness: 98, date: n(timestamp), humidity: 79, temperature: 100}

//===========DATABASE==================================================/



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

    let chart = new google.visualization.LineChart(document.getElementById('tempe_chart'));
    chart.draw(data, options);
  }
  //================LINE CHART TEMPERATURE==========================================/

  //================LINE CHART HUMIDITY==========================================/
  google.charts.setOnLoadCallback(humidityChart);

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

    let chart = new google.visualization.LineChart(document.getElementById('humid_chart'));
    chart.draw(data, options);
  }
  //================LINE CHART HUMIDITY==========================================/

    //================LINE CHART BRIGHTNESS==========================================/
    google.charts.setOnLoadCallback(brightnessChart);
    
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
        }
      };
  
      let chart = new google.visualization.LineChart(document.getElementById('brigh_chart'));
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
}

//Redraw charts after window resizing 
window.onresize = function() {drawChartAndTable(database)};

//Checks the data for null/undefined values and if the error field exists
function checkDataCorruption(obj){
  let checkCounter = 0;
  checkCounter += obj.brightness==null||undefined?0:1;
  checkCounter += obj.humidity==null||undefined?0:1;
  checkCounter += obj.temperature==null||undefined?0:1;
  checkCounter += obj.date==null||undefined?0:1;
  if (checkCounter < 4 || obj.error != undefined){
    return false;
  }else{
    return true;//if the data is clean returns true
  }
}
