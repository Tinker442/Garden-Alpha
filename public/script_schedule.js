

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

