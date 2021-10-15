var arrHead = new Array();	// array for header.
arrHead = ['', 'Opponent Rating', 'Did you win?'];

// first create TABLE structure with the headers. 
function createTable() {
    var empTable = document.createElement('table');
    empTable.setAttribute('id', 'empTable'); // table id.
    empTable.setAttribute('align',"center");
    var iniRow = empTable.insertRow(-1);
    var th = document.createElement('th'); 
    th.innerHTML = 'My Pre-tournament Rating';
    iniRow.appendChild(th);        
    var iniRating = document.createElement('input'); 
    iniRating.setAttribute('type', 'text');
    iniRating.setAttribute('maxlength', 4);
    iniRating.setAttribute('value', '');
    iniRating.setAttribute('class','center');
    iniRating.setAttribute('selected', 'selected');
    iniRow.appendChild(iniRating);  
    
    var tr = empTable.insertRow(-1);        
    for (var h = 0; h < arrHead.length; h++) {
        var th = document.createElement('th'); // create table headers
        th.innerHTML = arrHead[h];
        tr.appendChild(th);
    }

    var div = document.getElementById('cont');
    div.appendChild(empTable);  // add the TABLE to the container.
    addRow(); //first match row is mandatory. 
}

// now, add a new to the TABLE.
function addRow() {
    var empTab = document.getElementById('empTable');

    var rowCnt = empTab.rows.length;   // table row count.
    var tr = empTab.insertRow(rowCnt); // the table row.
    tr = empTab.insertRow(rowCnt);

    for (var c = 0; c < arrHead.length; c++) {
        var td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);

        if (c == 0) {      // the first column.
            // add a button in every new row in the first column.
            var button = document.createElement('input');

            // set input attributes.
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Remove');

            // add button's 'onclick' event.
            button.setAttribute('onclick', 'removeRow(this)');

            td.appendChild(button);
        }
        else if (c == 1) {
            // 2nd will have textbox.
            var ele = document.createElement('input');
            ele.setAttribute('type', 'text');
            ele.setAttribute('value', '');
            ele.setAttribute('maxlength', 4);
            ele.setAttribute('selected', 'selected');
            td.appendChild(ele);
        }        
        else{
            // 2nd column, will have option.                
            var ele = document.createElement('select');
            //const optionText = document.createTextNode('Option Text');
            var values = ['', 'yes', 'no']
            for (const val of values) {
              var option = document.createElement("option");
              option.value = val;
              option.text = val.charAt(0).toUpperCase() + val.slice(1);
              ele.appendChild(option);
            }               
            td.appendChild(ele);
        }
    }
}

// delete TABLE row function.
function removeRow(oButton) {
    var empTab = document.getElementById('empTable');
    empTab.deleteRow(oButton.parentNode.parentNode.rowIndex); 
}

// function to extract and submit table data.
function submit() {
    var myTab = document.getElementById('empTable');
    var arrValues = new Array();

    // check row 1 to get initial rating. 
    var firstRow = myTab.rows.item(0);  
    var parseVal = parseInt(firstRow.childNodes[1].value)
    if(isNaN(parseVal)){
        alert("invalid pre-tournament rating!");
        firstRow.childNodes[1].select();
        return false;
    }
    arrValues.push(parseVal);
    // loop through other rows of the table.
    for (row = 2; row < myTab.rows.length - 1; row++) {
        // loop through each cell in a row.
        for (c = 1; c < myTab.rows[row].cells.length; c++) {  
            var element = myTab.rows.item(row).cells[c];
            if(c==1){
              var parseVal = parseInt(element.childNodes[0].value)
              if(isNaN(parseVal)){
                alert("invalid opponent rating!");
                element.childNodes[0].select();
                return false;
              }
              arrValues.push(parseVal);
            }
            if(c==2){
              if(element.childNodes[0].value == ''){
                alert("You haven't selected whether you win or not!");
                element.childNodes[0].select();
                return false;
              }
              var isTrueSet = (element.childNodes[0].value === 'yes');
              arrValues.push(isTrueSet);
            }
            
        }
    }
    
    // The final output.
    document.getElementById('output').innerHTML = calcRating(arrValues);
    console.log (arrValues);   // you can see the array values in your browsers console window. 
}
function calcRating(arrValues){
    const iniRating = arrValues[0];
      var arrValues_win = new Array();
    var arrValues_loss = new Array();
    for (i=1;i<arrValues.length-1;i+=2){
      if(arrValues[i+1]){arrValues_win.push(arrValues[i]);}
      else {arrValues_loss.push(arrValues[i]);}
    }
                      
    var passOnePoints = 0;
    for (i=1;i<arrValues.length-1;i+=2){
        ratingGain = points_for_game(iniRating, arrValues[i], arrValues[i+1]);
        passOnePoints +=ratingGain;
    }

    //Adjust if needed.
    var adjustedRating;
    //separate handling of Rating 0 and non-0 case.                
    if(iniRating == 0){

      if(arrValues_loss.length == 0 ){//all win
        adjustedRating = median(arrValues_win);
      }
      else if(arrValues_win.length == 0){
        adjustedRating = Math.min(...arrValues_loss);
      }

      else{
        adjustedRating= (Math.min(...arrValues_loss) + Math.max(...arrValues_win))/2;
      }
    }
    else{
      //Get adjusted rating based on pass1 points gained. 
      if(passOnePoints <50){//no adjustment needed.
          finalRating = iniRating + passOnePoints;
          return "Your final rating is " + finalRating;
      }
      else if(passOnePoints <75){
          //Adjust initial rating with tier pass1 method =
          adjustedRating = iniRating + passOnePoints;
      }
      else{
        //Adjusted with PASS2 method!Seems USTTA used average of pass1 rating and average of  best win and worst loss.
          if(arrValues_loss.length == 0 ){//all win
              adjustedRating = median(arrValues_win);
          }
          else if(arrValues_win.length == 0){
              adjustedRating = median(arrValues_loss);
          }
          else {adjustedRating = (iniRating + passOnePoints +(Math.min(...arrValues_loss) + Math.max(...arrValues_win))/2)/2;
          }
        }
    }
    //PASS2 calculation. 
    adjustedRating = Math.round(adjustedRating);
    var passTwoPoints = 0;
    for (i=1;i<arrValues.length-1;i+=2){
        ratingGain = points_for_game(adjustedRating, arrValues[i], arrValues[i+1]);
        passTwoPoints +=ratingGain;
    }
    finalRating = adjustedRating + passTwoPoints;
    //return typeof(arrValues[2]);
    return "Great job, your pre-tournament rating is adjusted to "+ adjustedRating +" and your final rating is "+ finalRating;
}
function points_for_game(aRating, bRating, win){
    points_for_player_a = 0
    dif_points = Math.abs(aRating - bRating)
    if(aRating >= bRating && win){
        if(dif_points <= 12){points_for_player_a += 8;}
        else if(dif_points <= 37){points_for_player_a += 7;}                        
        else if(dif_points <= 62){points_for_player_a += 6;}
        else if(dif_points <= 87){points_for_player_a += 5;}
        else if(dif_points <= 112){points_for_player_a += 4;}
        else if(dif_points <= 137){points_for_player_a += 3;}
        else if(dif_points <= 162){points_for_player_a += 2;}
        else if(dif_points <= 187){points_for_player_a += 2;}
        else if(dif_points <= 212){points_for_player_a += 1;}
        else if(dif_points <= 237){points_for_player_a += 1;}
        else {points_for_player_a += 0;}
    }
    else if(aRating >= bRating && !win){
        if(dif_points <= 12){points_for_player_a -= 8;}
        else if(dif_points <= 37){points_for_player_a -= 10;}
        else if(dif_points <= 62){points_for_player_a -= 13;}
        else if(dif_points <= 87){points_for_player_a -= 16;}
        else if(dif_points <= 112){points_for_player_a -= 20;}
        else if(dif_points <= 137){points_for_player_a -= 25;}
        else if(dif_points <= 162){points_for_player_a -= 30;}
        else if(dif_points <= 187){points_for_player_a -= 35;}
        else if(dif_points <= 212){points_for_player_a -= 40;}
        else if(dif_points <= 237){points_for_player_a -= 45;}
        else {points_for_player_a -= 50;}
    }
    else if(aRating < bRating && !win){
        if(dif_points <= 12){points_for_player_a -= 8;}
        else if(dif_points <= 37){points_for_player_a -= 7;}
        else if(dif_points <= 62){points_for_player_a -= 6;}
        else if(dif_points <= 87){points_for_player_a -= 5;}
        else if(dif_points <= 112){points_for_player_a -= 4;}
        else if(dif_points <= 137){points_for_player_a -= 3;}
        else if(dif_points <= 162){points_for_player_a -= 2;}
        else if(dif_points <= 187){points_for_player_a -= 2;}
        else if(dif_points <= 212){points_for_player_a -= 1;}
        else if(dif_points <= 237){points_for_player_a -= 1;}
        else {points_for_player_a -= 0;}
    }
    else if(aRating < bRating && win){
        if(dif_points <= 12){points_for_player_a += 8;}
        else if(dif_points <= 37){points_for_player_a += 10;}
        else if(dif_points <= 62){points_for_player_a += 13;}
        else if(dif_points <= 87){points_for_player_a += 16;}
        else if(dif_points <= 112){points_for_player_a += 20;}
        else if(dif_points <= 137){points_for_player_a += 25;}
        else if(dif_points <= 162){points_for_player_a += 30;}
        else if(dif_points <= 187){points_for_player_a += 35;}
        else if(dif_points <= 212){points_for_player_a += 40;}
        else if(dif_points <= 237){points_for_player_a += 45;}
        else {points_for_player_a += 50;}
    }
    else {alert("Warning: Not Valid Case: ratings:"+aRating+","+bRating+" with win/loss "+win+". Please fix input");}
    return points_for_player_a;
}
function median(values){
  if(values.length ===0) return 0;

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}
