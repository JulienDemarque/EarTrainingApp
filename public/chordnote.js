document.addEventListener("DOMContentLoaded", function(event) {

  const chromaticScale = [{
      name: "Do",
      url: "/audio/Do.mp3"
    },
    {
      name: "DoS",
      url: "/audio/DoS.mp3"
    },
    {
      name: "Re",
      url: "/audio/Re.mp3"
    },
    {
      name: "ReS",
      url: "/audio/ReS.mp3"
    },
    {
      name: "Mi",
      url: "/audio/Mi.mp3"
    },
    {
      name: "Fa",
      url: "/audio/Fa.mp3"
    },
    {
      name: "FaS",
      url: "/audio/FaS.mp3"
    },
    {
      name: "Sol",
      url: "/audio/Sol.mp3"
    },
    {
      name: "SolS",
      url: "/audio/SolS.mp3"
    },
    {
      name: "La",
      url: "/audio/La.mp3"
    },
    {
      name: "LaS",
      url: "/audio/LaS.mp3"
    },
    {
      name: "Si",
      url: "/audio/Si.mp3"
    },
    {
      name: "Do4",
      url: "/audio/Do4.mp3"
    },
    {
      name: "Do4S",
      url: "/audio/Do4S.mp3"
    },
    {
      name: "Re4",
      url: "/audio/Re4.mp3"
    },
    {
      name: "Re4S",
      url: "/audio/Re4S.mp3"
    },
    {
      name: "Mi4",
      url: "/audio/Mi4.mp3"
    },
    {
      name: "Fa4",
      url: "/audio/Fa4.mp3"
    },
    {
      name: "Fa4S",
      url: "/audio/Fa4S.mp3"
    }
  ];

  const harmonization = ["major", "minor", "minor", "major", "major", "minor", "dim"];
  //index are the levels, value are the index of the corresponding note in the chromaticScale in C major.
  const levelsToChord = [0, 2, 4, 5, 7, 9, 11];
  const levelsToNote = [0, 4, 7, 2, 5, 9, 11, 1, 3, 6, 8, 10];
  //Selecting DOM nodes
  const answersBtnNote = document.querySelectorAll(".note button[data-note]");
  const answersBtnChord = document.querySelectorAll(".chord button[data-chord]");
  const progressDiv = document.getElementById("progress");
  const levelUpDiv = document.getElementById("levelUp");
  const resultsNoteDisplay = document.getElementById("resultsNote");
  const resultsChordDisplay = document.getElementById("resultsChord");
  const nextBtn = document.getElementById("next");
  const againBtn = document.getElementById("again");
  const startBtn = document.getElementById("start");
  const gameInterface = document.getElementById("gameInterface");
  const sessionResult = document.getElementById("sessionResult");


  progressDiv.style.width = 0;
  let sessionScore = {
    rightAnswers: 0,
    wrongAnswers: 0
  };
  let level = 4;
  let levelChord = level < 8 ? 3 : level - 4;
  let key;
  let context;
  let random;
  let randomChord;
  let randomChordName;
  let randomNoteName;
  let progress = 0;
  let numberOfTryNote = 0;
  let numberOfTryChord = 0;
  let answerNoteCorrect = false;
  let answerChordCorrect = false;
  let gotResult = false;
  let results = [];

  startBtn.addEventListener("click", startGame);
  nextBtn.addEventListener("click", nextQuestion);
  againBtn.addEventListener("click", playAgain);
  loadBuffers();
  attachEventListener();
  showHideAnswerBtn();


  function loadBuffers() {
    context = new(window.AudioContext || window.webkitAudioContext)();
    chromaticScale.forEach(pushBufferToArray);
    //we go trough each url and create a buffer for each...
    function pushBufferToArray(obj, index) {
      let request = new XMLHttpRequest();
      request.open('get', obj.url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        context.decodeAudioData(request.response, function(theBuffer) {
          chromaticScale[index].buffer = theBuffer;
          //console.log(chromaticScale);
        });
      };
      request.send();
    }
  }

  function startGame() {
    startBtn.classList.add("hide");
    gameInterface.classList.remove("hide");
    nextQuestion();
  }

  function play251() {
    //play II
    playBuffer(chromaticScale[(key + 2) % 12].buffer, 0);
    playBuffer(chromaticScale[(key + 5) % 12].buffer, 0);
    playBuffer(chromaticScale[(key + 9) % 12].buffer, 0);

    //play V
    playBuffer(chromaticScale[(key + 7) % 12].buffer, 0.6);
    playBuffer(chromaticScale[(key + 11) % 12].buffer, 0.6);
    playBuffer(chromaticScale[(key + 14) % 12].buffer, 0.6);

    //play I
    playBuffer(chromaticScale[(key) % 12].buffer, 1.2);
    playBuffer(chromaticScale[(key + 4) % 12].buffer, 1.2);
    playBuffer(chromaticScale[(key + 7) % 12].buffer, 1.2);
  }

  //This a reusable function to play a sound. Very handy
  function playBuffer(buffer, delay) {
    var source = context.createBufferSource();
    var now = context.currentTime;
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(now + delay);
  }

  function nextQuestion() {
    gotResult = false;
    nextBtn.classList.add("hide");
    resultsChordDisplay.innerText = "";
    resultsNoteDisplay.innerText = "";
    showHideAnswerBtn();
    numberOfTryNote = 0;
    numberOfTryChord = 0;
    answerNoteCorrect = false;
    answerChordCorrect = false;
    key = Math.floor(Math.random() * 12);
    random = Math.floor(Math.random() * level);
    randomChord = Math.floor(Math.random() * levelChord);
    //remove wrong or right class...
    answersBtnNote.forEach(function(btn) {
      btn.classList.remove("right");
      btn.classList.remove("wrong");
    })
    answersBtnChord.forEach(function(btn) {
      btn.classList.remove("right");
      btn.classList.remove("wrong");
    })
    playAgain();
  }

  function playAgain() {
    //Play key
    play251();
    //Play chord
    let bufferRoot;
    let bufferThird;
    let bufferFifth;
    bufferRoot = chromaticScale[(levelsToChord[randomChord] + key) % 12].buffer;
    //console.log("key : ", chromaticScale[key].name);
    //console.log("randomChordRoot : chromaticScale[(levelsToChord[randomChord]+key)%12].name ", chromaticScale[(levelsToChord[randomChord] + key) % 12].name);
    if (harmonization[randomChord] === "major") {
      bufferThird = chromaticScale[(levelsToChord[randomChord] + key) % 12 + 4].buffer;
      bufferFifth = chromaticScale[(levelsToChord[randomChord] + key) % 12 + 7].buffer;
    } else if (harmonization[randomChord] === "minor") {
      bufferThird = chromaticScale[(levelsToChord[randomChord] + key) % 12 + 3].buffer;
      bufferFifth = chromaticScale[(levelsToChord[randomChord] + key) % 12 + 7].buffer;
    } else if (harmonization[randomChord] === "dim") {
      bufferThird = chromaticScale[(levelsToChord[randomChord] + key) % 12 + 3].buffer;
      bufferFifth = chromaticScale[(levelsToChord[randomChord] + key) % 12 + 6].buffer;
    }
    playBuffer(bufferRoot, 2.5);
    playBuffer(bufferThird, 2.5);
    playBuffer(bufferFifth, 2.5);
    randomChordName = chromaticScale[levelsToChord[randomChord]].name;
    console.log("Chord name : ", randomChordName);
    //Play Note
    let buffer = chromaticScale[(levelsToNote[random] + key) % 12].buffer;
    playBuffer(buffer, 3.5);
    randomNoteName = chromaticScale[levelsToNote[random]].name;
    //console.log("Note name : ", randomNoteName);
  }

  function checkAnswerNote(e) {

    let answer = e.target.dataset.note;
    if (answer === randomNoteName) {
      //We update answerNoteCorrect only at the first try
      if (numberOfTryNote === 0) {
        answerNoteCorrect = true;

      }
      e.target.classList.add("right");
      resultsNoteDisplay.innerText = `Well done, ${randomNoteName} is the right answer!`;
    } else {
      //We update answerNoteCorrect only at the first try
      if (numberOfTryNote === 0) {
        answerNoteCorrect = false;
      }
      if (!answerNoteCorrect) {
        //We want to "activate" the answer buttons only if we didn't already find the answer
        e.target.classList.add("wrong");
        resultsNoteDisplay.innerText = `Nope, ${randomNoteName} is not correct.`;
      }
    }
    numberOfTryNote++;
    if (numberOfTryNote === 1) {
      checkFullAnswer();
    }
  }

  function checkAnswerChord(e) {
    const resultsChordDisplay = document.getElementById("resultsChord");
    let answer = e.target.dataset.chord;
    if (answer === randomChordName) {
      //We update answerChordCorrect only at the first try
      if (numberOfTryChord === 0) {
        answerChordCorrect = true;
      }
      e.target.classList.add("right");
      resultsChordDisplay.innerText = `Well done, ${randomChordName} is the right answer!`;
    } else {
      //We update answerChordCorrect only at the first try
      if (numberOfTryChord === 0) {
        answerChordCorrect = false;
      }
      if (!answerChordCorrect) {
        //We want to "activate" the answer buttons only if we didn't already find the answer
        e.target.classList.add("wrong");
        resultsChordDisplay.innerText = `Nope, ${randomChordName} is not correct.`;
      }
    }
    numberOfTryChord++;
    if (numberOfTryChord === 1) {
      checkFullAnswer();
    }
  }

  function checkFullAnswer() {
    let success;
    //Check if right answer for the 2 and first try.
    if (numberOfTryNote === 1 && numberOfTryChord === 1 && answerNoteCorrect && answerChordCorrect && !gotResult) {
      progress += 25;
      success = true;
      gotResult = true;
      updateProgress();
      sessionScore.rightAnswers++;

    } else if ((numberOfTryNote === 1 && !answerNoteCorrect && !gotResult) || (numberOfTryChord === 1 && !answerChordCorrect && !gotResult)) {
      //we did at least one try on the chord and the note. So we can say if it failed
      progress = progress - 100 < 0 ? 0 : progress - 100;
      success = false;
      gotResult = true;
      updateProgress();
      sessionScore.wrongAnswers++;

    }
    console.log("numberOfTryNote,  numberOfTryChord : ", numberOfTryNote, numberOfTryChord);
    if (numberOfTryNote >= 1 && numberOfTryChord >= 1) {
      nextBtn.classList.remove("hide");
    }
    sessionResult.innerText = `${sessionScore.rightAnswers} of ${sessionScore.rightAnswers + sessionScore.wrongAnswers} correct`;

    if (success !== undefined) {
      sendDataToServer(success);
    }
  }

  //display progress bar and move to level.
  function updateProgress() {
    //checking if we level up!
    if (progress === 400) {
      console.log("level up!");
      level++;
      progress = 0;
      //display level up text
      levelUpDiv.style.display = "inline";
      setTimeout(function() {
        levelUpDiv.style.display = "none";
      }, 3000);
      nextQuestion();
    }
    progressDiv.style.width = progress / 4 + "%";
  }


  //Show or Hide answer buttons according to level
  function showHideAnswerBtn() {
    answersBtnNote.forEach(function(btn) {
      btn.classList.remove("hide");
      if (btn.dataset.level >= level) {
        btn.classList.add("hide");
      }
    });
    answersBtnChord.forEach(function(btn) {
      btn.classList.remove("hide");
      if (btn.dataset.level >= levelChord) {
        btn.classList.add("hide");
      }
    });
  }

  function sendDataToServer(success) {
    results.push({
      level: level - 4,
      success: success
    });
    console.log(results);
    //We are debouncing the post request,
    //we store 5 results and then send so the server don't think we are doing a DDoS attack
    if (results.length === 5) {
      //now we make the post request
      makePostRequest();
      //Then we empty are results array.
      results = [];
    }
  }

  function makePostRequest() {
    const params = {
      results: results
    };
    const http = new XMLHttpRequest()
    http.open('POST', '/chordnote', true)
    http.setRequestHeader('Content-type', 'application/json')
    http.send(JSON.stringify(params)) // Make sure to stringify
    http.onload = function() {
      // Do whatever with response
      console.log(http.responseText);
    }
  }


  //add Event listeners..
  function attachEventListener() {
    answersBtnNote.forEach(function(btn) {
      btn.addEventListener("click", checkAnswerNote);
    });

    answersBtnChord.forEach(function(btn) {
      btn.addEventListener("click", checkAnswerChord);
    });

  }

});
