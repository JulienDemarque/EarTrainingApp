$(document).ready(function(){

// Things to do. When modify input again, the check button doesn't show the new changes... DONE
// add pdf open button
// add info button


    var data = [
        {
        title: "Coquette (medium)",  
        key: "D",
        sheet: [
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"E", exten:"min7"},
            {divided: false, chord:"A", exten:"7"},
            {divided: false, chord:"E", exten:"min7"}, 
            {divided: false, chord:"A", exten:"7"}, 
            {divided: false, chord:"D", exten:"maj69"}, 
            {divided: true, chord:"E", exten:"min7"},
            {divided: true, chord:"A", exten:"7"},
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"E", exten:"min7"},
            {divided: false, chord:"A", exten:"7"},
            {divided: false, chord:"E", exten:"min7"}, 
            {divided: false, chord:"A", exten:"7"}, 
            {divided: false, chord:"D", exten:"maj69"}, 
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"D", exten:"7"},
            {divided: false, chord:"D", exten:"7"},
            {divided: false, chord:"G", exten:"maj6"},
            {divided: false, chord:"G", exten:"maj6"},
            {divided: false, chord:"E", exten:"7"},
            {divided: false, chord:"E", exten:"7"},
            {divided: false, chord:"E", exten:"min7"},
            {divided: false, chord:"A", exten:"7"}, 
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"D", exten:"maj69"},
            {divided: false, chord:"E", exten:"min7"},
            {divided: false, chord:"A", exten:"7"},
            {divided: false, chord:"E", exten:"min7"}, 
            {divided: false, chord:"A", exten:"7"}, 
            {divided: false, chord:"D", exten:"maj69"}, 
            {divided: true, chord:"E", exten:"min7"},
            {divided: true, chord:"A", exten:"7"},


          ],
        audio: "url",
        key: "G"  
      }
    ];


    function randomSong(){
      return Math.floor(Math.random()*data.length);
    }

    

    var song= data[randomSong()];

    //Logic here for react or js: make a loop through array. if divided is false, add a simple cell, if divided is true, add a divided cell and add i++ (so you don't create 2 divided cells).
    //test with container div:

    function buildSheet(){
        $("#key").text(song.key);
        for (i=0; i<song.sheet.length; i++){
        if(!song.sheet[i].divided){
          console.log("cell");
          var html = $(".lead-sheet").html();
          $(".lead-sheet").html(html + "<div id='"+ i +"' tabindex='-1' class= 'cell full'></div>");
        } else {
           console.log("divided cell");
          var html = $(".lead-sheet").html();
          var num = i+1;
          var numString = num.toString();
          $(".lead-sheet").html(html + "<div class = 'divided cell'><div class= 'diagonal'></div> <div id='"+ i +"' tabindex='-1'  class='topLeft'></div> <div id='"+ numString +"' tabindex='-1'  class='bottomRight'></div></div>");
          i++;
        }
      }
      console.log($(".lead-sheet").html());
    }

    buildSheet();


//handle button change song
    function changeSong(){
      song= data[randomSong()];
      $(".lead-sheet").empty();
      resetData();
      buildSheet();
      addEventListeners();
    }

    function resetData(){
      answer= [];
      buildAnswerArray();
    }

    $("#changeBtn").click(function(){
        changeSong();
    });



//Handle input
     var answer= [];

    function buildAnswerArray(){
     
      for(i=0; i<song.sheet.length; i++){
        answer.push({chord:"", exten:""});
      }
      console.log(answer);
    };  

    buildAnswerArray();



    var index;
    var chord;
    var extension ="";
    var fullChord;



//event listeners for input buttons
function addEventListeners(){
    $(".cell").click(function(){
      $(".rooty").removeClass("oncus");
      $(".extension").removeClass("onFocus");
      $(".cell").removeClass("onFocus");
      $(".cell").removeClass("selected");
      chord = "";
      extension ="";
      
      $(this).addClass("onFocus");
      $(this).addClass("selected"); 
      index = parseInt($(this).attr("id"));
    });



    $(".rooty").click(function(){
      $(".rooty").removeClass("onFocus");
      $(this).addClass("onFocus");
      chord= $(this).text();
      answer[index].chord = chord;
      //console.log(answer);
      displayFullChord(".selected");
    });

    $(".extension").click(function(){
      $(".extension").removeClass("onFocus");
      $(this).addClass("onFocus");
      extension= $(this).text();
      answer[index].exten = extension;
      //console.log(answer);
      displayFullChord(".selected");
    });

}

addEventListeners();


  


    function displayFullChord(cell){
      var displayExt = "";
      if(extension == "maj"){
        displayExt = "";
      } else if(extension == "maj6"){
        displayExt = "<sup>6</sup>";
      } else if(extension == "maj69"){
        displayExt = "<span class='supsub'><sup>6</sup><sub>9</sub></span>";
      } else if(extension == "min7"){
        displayExt = "<sub>m</sub><sup>7</sup>";
      } else if(extension == "7"){
        displayExt = "<sup>7</sup>";
      }
      fullChord = chord + displayExt;
      $(cell).html(fullChord);
    }



    $("#check").click(function(){
      checkAnswer();
    });
    function isAnswerCorrect(sheet, answer) {return sheet.chord == answer.chord && sheet.exten == answer.exten}
    function isAnswerAlmostCorrect(sheet, answer){return sheet.chord == answer.chord && sheet.exten !== answer.exten}

   function markAs(status, i) {
           $("#"+i).removeClass("almostCorrect");
            $("#"+i).removeClass("wrong");
            $("#"+i).removeClass("correct");
            $("#"+i).addClass(status);
          }
    function checkAnswer(){
      for (i=0; i<song.sheet.length; i++){
        const currentSheet = song.sheet[i];
        const currentAnswer = answer[i];

      /* console.log("sheet chord "+ i + " " + song.sheet[i].chord);
       console.log("sheet exten "+ i + " " + song.sheet[i].exten);
       console.log("answer chord " + i + " " + answer[i].chord);
       console.log("answer exten " + i + " " + answer[i].exten);*/
       
        if(isAnswerCorrect(currentSheet, currentAnswer)){
          markAs("correct", i);
        } else if (isAnswerAlmostCorrect(currentSheet, currentAnswer)){
          markAs("almostCorrect", i);
           
        } else {
          //console.log(i);
          markAs("wrong", i);
        }
      }
    }

    $("#showAnswer").click(function(){
      showAnswer();
    });

    function showAnswer(){
      for (i=0; i<song.sheet.length; i++){
        chord= song.sheet[i].chord;
        extension= song.sheet[i].exten;

       displayFullChord("#"+i); 
      }
    }


});

