$(document).ready(function(){

// Things to do. When modify input again, the check button doesn't show the new changes... DONE
// add pdf open button
// add info button



    function randomSong(){
      return Math.floor(Math.random()*data.length);
    }

    
    var song= data[randomSong()];

    function setAudio(){
    	var audio = document.getElementById('audio');
    	$("source").attr("src", "./audio/" + song.audio +".mp3");
    	audio.load()
    }

    setAudio();

    function buildSheet(){
        $("#key").text(song.key);
        for (i=0; i<song.sheet.length; i++){
        if(!song.sheet[i].divided){
          //console.log("cell");
          var html = $(".lead-sheet").html();
          $(".lead-sheet").html(html + "<div id='"+ i +"' tabindex='-1' class= 'cell full'></div>");
        } else {
           //console.log("divided cell");
          var html = $(".lead-sheet").html();
          var num = i+1;
          var numString = num.toString();
          $(".lead-sheet").html(html + "<div class = 'box'><div class= 'diagonal'></div> <div id='"+ i +"' tabindex='-1'  class='divided topLeft cell'></div> <div id='"+ numString +"' tabindex='-1'  class='divided bottomRight cell'></div></div>");
          i++;
        }
      }
      console.log($(".lead-sheet").html());
    }

    buildSheet();


//handle button change song
    function changeSong(){

      song= data[randomSong()];
      setAudio();	
      $(".lead-sheet").empty();
      resetData();
      buildSheet();
      addEventListeners();
    }

    function resetData(){
    $("#song-title").text("");	
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
      $(".rooty").removeClass("onFocus");
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
      } else if(extension == "min"){
        displayExt = "<sub>m</sub>";
      } else if(extension == "min7"){
        displayExt = "<sub>m</sub><sup>7</sup>";
      } else if(extension == "min6"){
        displayExt = "<sub>m</sub><sup>6</sup>";
      } else if(extension == "7"){
        displayExt = "<sup>7</sup>";
      } else if(extension == "9"){
        displayExt = "<sup>9</sup>";
      } else if(extension == "dim7"){
        displayExt = "<sup>O</sup>";
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
    	$("#song-title").text("Song Title: " + song.title);
      $("#pdf").html('PDF: <a target="_blank" href="./PDF Ear App/'+ song.pdf +'.pdf">'+ song.title +'</a>');
      for (i=0; i<song.sheet.length; i++){
        chord= song.sheet[i].chord;
        extension= song.sheet[i].exten;

       displayFullChord("#"+i); 
      }
    }


});
    var data = [
        {
        pdf: "Coquette Ear App",  
        title: "Coquette",  
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
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"G", exten:"maj"},
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
            {divided: true, chord:"A", exten:"7"}
          ],
        audio: "Coquette Ear App"
      },
      {
        pdf: "Blues 1 Ear App", 
        title: "Blues 1",  
        key: "G",
        sheet: [
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"C", exten:"7"},
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"G", exten:"7"},
            {divided: false, chord:"C", exten:"7"}, 
            {divided: false, chord:"C", exten:"7"}, 
            {divided: false, chord:"G", exten:"maj"}, 
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"D", exten:"7"},
            {divided: false, chord:"C", exten:"7"},
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"D", exten:"7"}
          ],
        audio: "Blues 1 Ear App"
      },
      { pdf: "Blues 2 Ear App",
        title: "Blues 2",  
        key: "G",
        sheet: [
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"C", exten:"7"},
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"G", exten:"7"},
            {divided: false, chord:"C", exten:"7"}, 
            {divided: false, chord:"C", exten:"7"}, 
            {divided: false, chord:"G", exten:"maj"}, 
            {divided: false, chord:"E", exten:"7"},
            {divided: false, chord:"A", exten:"min7"},
            {divided: false, chord:"D", exten:"7"},
            {divided: true, chord:"G", exten:"maj"},
            {divided: true, chord:"E", exten:"7"},
            {divided: true, chord:"A", exten:"7"},
            {divided: true, chord:"D", exten:"7"}
          ],
        audio: "Blues 2 Ear App"
      },
      { pdf: "Blues 3 Ear App",
        title: "Blues 3",  
        key: "G",
        sheet: [
            {divided: false, chord:"G", exten:"maj"},
            {divided: false, chord:"C", exten:"7"},
            {divided: false, chord:"G", exten:"maj"},
            {divided: true, chord:"D", exten:"min7"},
            {divided: true, chord:"G", exten:"7"},
            {divided: false, chord:"C", exten:"7"}, 
            {divided: false, chord:"C#/Db", exten:"dim7"}, 
            {divided: false, chord:"G", exten:"maj"}, 
            {divided: false, chord:"E", exten:"7"},
            {divided: false, chord:"A", exten:"min7"},
            {divided: false, chord:"D", exten:"7"},
            {divided: true, chord:"G", exten:"maj"},
            {divided: true, chord:"E", exten:"7"},
            {divided: true, chord:"A", exten:"7"},
            {divided: true, chord:"D", exten:"7"}
          ],
        audio: "Blues 3 Ear App"
      },
      { pdf: "Minor Swing",
        title: "Minor Swing",  
        key: "A",
        sheet: [
            {divided: false, chord:"A", exten:"min6"},
            {divided: false, chord:"A", exten:"min6"},
            {divided: false, chord:"D", exten:"min"},
            {divided: false, chord:"D", exten:"min"},
            {divided: false, chord:"E", exten:"7"}, 
            {divided: false, chord:"E", exten:"7"}, 
            {divided: false, chord:"A", exten:"min6"}, 
            {divided: false, chord:"A", exten:"min6"},
            {divided: false, chord:"D", exten:"min"},
            {divided: false, chord:"D", exten:"min"},
            {divided: false, chord:"A", exten:"min6"},
            {divided: false, chord:"A", exten:"min6"},
            {divided: false, chord:"A#/Bb", exten:"maj6"},
            {divided: false, chord:"E", exten:"7"},
            {divided: false, chord:"A", exten:"min6"},
            {divided: false, chord:"E", exten:"7"}
          ],
        audio: "Minor Swing Ear App"
      },
      { pdf: "I can't give you anything but love Ear App",
        title: "I can't give you anything but love",  
        key: "G",
        sheet: [
            {divided: false, chord:"G", exten:"maj6"},
            {divided: true, chord:"G", exten:"maj"},
            {divided: true, chord:"A#/Bb", exten:"dim7"},
            {divided: false, chord:"A", exten:"min7"},
            {divided: false, chord:"D", exten:"9"}, 
            {divided: false, chord:"G", exten:"maj6"},
            {divided: true, chord:"G", exten:"maj"},
            {divided: true, chord:"A#/Bb", exten:"dim7"},
            {divided: false, chord:"A", exten:"min7"},
            {divided: false, chord:"D", exten:"9"}, 
            {divided: false, chord:"D", exten:"min7"}, 
            {divided: false, chord:"G", exten:"7"}, 
            {divided: false, chord:"C", exten:"maj69"}, 
            {divided: false, chord:"C", exten:"maj69"}, 
            {divided: false, chord:"A", exten:"7"}, 
            {divided: false, chord:"A", exten:"7"}, 
            {divided: false, chord:"D", exten:"9"}, 
            {divided: false, chord:"D", exten:"9"}, 
            {divided: false, chord:"G", exten:"maj6"},
            {divided: true, chord:"G", exten:"maj"},
            {divided: true, chord:"A#/Bb", exten:"dim7"},
            {divided: false, chord:"A", exten:"min7"},
            {divided: false, chord:"D", exten:"9"}, 
            {divided: false, chord:"D", exten:"min7"}, 
            {divided: false, chord:"G", exten:"7"}, 
            {divided: false, chord:"C", exten:"maj69"}, 
            {divided: false, chord:"C", exten:"maj69"}, 
            {divided: false, chord:"C", exten:"maj69"}, 
            {divided: false, chord:"C#/Db", exten:"dim7"}, 
            {divided: false, chord:"G", exten:"maj6"}, 
            {divided: false, chord:"E", exten:"7"}, 
            {divided: false, chord:"A", exten:"min7"}, 
            {divided: false, chord:"D", exten:"9"}, 
            {divided: false, chord:"G", exten:"maj6"}, 
            {divided: false, chord:"D", exten:"9"}
          ],
        audio: "I can't give you anything but love Ear App"
      },
      { pdf: "St James Infirmary Ear App",
        title: "St James Infirmary Blues",  
        key: "D",
        sheet: [
            {divided: true, chord:"D", exten:"min"},
            {divided: true, chord:"A", exten:"7"},
            {divided: false, chord:"D", exten:"min"},
            {divided: true, chord:"D", exten:"min"},
            {divided: true, chord:"G", exten:"min"}, 
            {divided: false, chord:"A", exten:"7"}, 
            {divided: true, chord:"D", exten:"min"}, 
            {divided: true, chord:"A", exten:"7"},
            {divided: false, chord:"D", exten:"min"},
            {divided: true, chord:"A#/Bb", exten:"7"},
            {divided: true, chord:"A", exten:"7"},
            {divided: true, chord:"D", exten:"min"},
            {divided: true, chord:"A", exten:"7"}
          ],
        audio: "St James Infirmary Ear App"
      }
    ];


