$(document).ready(() => {
  // Things to do. When modify input again, the check button doesn't show the new changes... DONE
  // add pdf open button DONE
  // add info button DONE

  // GUIDE APPEAR DISAPPEAR
  document.getElementById("guideLink").addEventListener("click", () => {
    $(".info").removeClass("invisible");
  });

  document.getElementById("closingWindow").addEventListener("click", () => {
    $(".info").addClass("invisible");
  });

  $(".info").click(() => {
    $(".info").addClass("invisible");
  });

  // SELECTION MODE
  const selection = document.getElementById("sel1");
  let mode = "swingBeginner";

  function modeChange() {
    mode = selection.options[selection.selectedIndex].value;
  }

  selection.addEventListener("change", modeChange);

  // CHOSING RANDOM SONG IN THE DATA
  function randomIndex(data) {
    return Math.floor(Math.random() * data.length);
  }

  let song = swingBeginner[randomIndex(swingBeginner)];

  function setAudio() {
    const audio = document.getElementById("audio");
    $("source").attr("src", `./audio/${song.audio}.mp3`);
    audio.load();
  }

  setAudio();

  // BUILD GRILLE
  function buildSheet() {
    $("#key").text(song.key);
    for (let i = 0; i < song.sheet.length; i++) {
      if (!song.sheet[i].divided) {
        // console.log("cell");
        var html = $(".lead-sheet").html();
        $(".lead-sheet").html(
          `${html}<div id='${i}' tabindex='-1' class= 'cell full'></div>`
        );
      } else {
        // console.log("divided cell");
        var html = $(".lead-sheet").html();
        const num = i + 1;
        const numString = num.toString();
        $(".lead-sheet").html(
          `${html}<div class = 'box'><div class= 'diagonal'></div> <div id='${i}' tabindex='-1'  class='divided topLeft cell'></div> <div id='${numString}' tabindex='-1'  class='divided bottomRight cell'></div></div>`
        );
        i++;
      }
    }
  }

  buildSheet();

  // CHANGE SONG
  function changeSong() {
    if (mode === "swingBeginner") {
      song = swingBeginner[randomIndex(swingBeginner)];
    } else if (mode === "swingIntermediate") {
      song = swingIntermediate[randomIndex(swingIntermediate)];
    }

    setAudio();
    $(".lead-sheet").empty();
    resetData();
    buildSheet();
    addEventListeners();
  }

  function resetData() {
    $("#song-title").text("");
    $("#pdf").empty();
    answer = [];
    buildAnswerArray();
  }

  $("#changeBtn").click(() => {
    changeSong();
  });

  // HANDLE INPUT
  var answer = [];

  function buildAnswerArray() {
    for (let i = 0; i < song.sheet.length; i++) {
      answer.push({ chord: "", exten: "" });
    }
  }

  buildAnswerArray();

  let index;
  let chord;
  let extension = "";
  let fullChord;

  // event listeners for input buttons
  function addEventListeners() {
    $(".cell").click(function() {
      $(".rooty").removeClass("onFocus");
      $(".extension").removeClass("onFocus");
      $(".cell").removeClass("onFocus");
      $(".cell").removeClass("selected");
      chord = "";
      extension = "";

      $(this).addClass("onFocus");
      $(this).addClass("selected");
      index = parseInt($(this).attr("id"));
    });

    $(".rooty").click(function() {
      $(".rooty").removeClass("onFocus");
      $(this).addClass("onFocus");
      chord = $(this).text();
      answer[index].chord = chord;
      displayFullChord(".selected");
    });

    $(".extension").click(function() {
      $(".extension").removeClass("onFocus");
      $(this).addClass("onFocus");
      extension = $(this).text();
      answer[index].exten = extension;
      displayFullChord(".selected");
    });
  }

  addEventListeners();

  function displayFullChord(cell) {
    let displayExt = "";
    if (extension === "maj") {
      displayExt = "";
    } else if (extension === "maj6") {
      displayExt = "<sup>6</sup>";
    } else if (extension === "maj69") {
      displayExt = "<span class='supsub'><sup>6</sup><sub>9</sub></span>";
    } else if (extension === "min") {
      displayExt = "<sub>m</sub>";
    } else if (extension === "min7") {
      displayExt = "<sub>m</sub><sup>7</sup>";
    } else if (extension === "min6") {
      displayExt = "<sub>m</sub><sup>6</sup>";
    } else if (extension === "7") {
      displayExt = "<sup>7</sup>";
    } else if (extension === "7b9") {
      displayExt = "<sup>7b9</sup>";
    } else if (extension === "9") {
      displayExt = "<sup>9</sup>";
    } else if (extension === "dim7") {
      displayExt = "<sup>O</sup>";
    } else if (extension === "min7b5") {
      displayExt = "<sub>m</sub><sup>7b5</sup>";
    }
    fullChord = chord + displayExt;
    $(cell).html(fullChord);
  }

  $("#check").click(() => {
    checkAnswer();
  });

  function isAnswerCorrect(sheet, answer) {
    return sheet.chord === answer.chord && sheet.exten === answer.exten;
  }
  function isAnswerAlmostCorrect(sheet, answer) {
    return sheet.chord === answer.chord && sheet.exten !== answer.exten;
  }

  function markAs(status, i) {
    $(`#${i}`).removeClass("almostCorrect");
    $(`#${i}`).removeClass("wrong");
    $(`#${i}`).removeClass("correct");
    $(`#${i}`).addClass(status);
  }

  function checkAnswer() {
    for (let i = 0; i < song.sheet.length; i++) {
      const currentSheet = song.sheet[i];
      const currentAnswer = answer[i];

      if (isAnswerCorrect(currentSheet, currentAnswer)) {
        markAs("correct", i);
      } else if (isAnswerAlmostCorrect(currentSheet, currentAnswer)) {
        markAs("almostCorrect", i);
      } else {
        markAs("wrong", i);
      }
    }
  }

  $("#showAnswer").click(() => {
    showAnswer();
  });

  function showAnswer() {
    $("#song-title").text(`Song Title: ${song.title}`);
    $("#pdf").html(
      `PDF: <a target="_blank" href="./PDF Ear App/${song.pdf}.pdf">${
        song.title
      }</a>`
    );
    for (let i = 0; i < song.sheet.length; i++) {
      chord = song.sheet[i].chord;
      extension = song.sheet[i].exten;

      displayFullChord(`#${i}`);
    }
  }
});

var swingBeginner = [
  {
    pdf: "Coquette Ear App",
    title: "Coquette",
    key: "D",
    sheet: [
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: true, chord: "E", exten: "min7" },
      { divided: true, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "E", exten: "min7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "maj69" },
      { divided: true, chord: "E", exten: "min7" },
      { divided: true, chord: "A", exten: "7" }
    ],
    audio: "Coquette Ear App"
  },
  {
    pdf: "Blues 1 Ear App",
    title: "Blues 1",
    key: "G",
    sheet: [
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "D", exten: "7" }
    ],
    audio: "Blues 1 Ear App"
  },
  {
    pdf: "Blues 2 Ear App",
    title: "Blues 2",
    key: "G",
    sheet: [
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: true, chord: "G", exten: "maj" },
      { divided: true, chord: "E", exten: "7" },
      { divided: true, chord: "A", exten: "7" },
      { divided: true, chord: "D", exten: "7" }
    ],
    audio: "Blues 2 Ear App"
  },
  {
    pdf: "Blues 3 Ear App",
    title: "Blues 3",
    key: "G",
    sheet: [
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: true, chord: "D", exten: "min7" },
      { divided: true, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "C#/Db", exten: "dim7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: true, chord: "G", exten: "maj" },
      { divided: true, chord: "E", exten: "7" },
      { divided: true, chord: "A", exten: "7" },
      { divided: true, chord: "D", exten: "7" }
    ],
    audio: "Blues 3 Ear App"
  },
  {
    pdf: "Minor Swing Ear App",
    title: "Minor Swing",
    key: "A",
    sheet: [
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "E", exten: "7" }
    ],
    audio: "Minor Swing Ear App"
  },
  {
    pdf: "I can't give you anything but love Ear App",
    title: "I can't give you anything but love",
    key: "G",
    sheet: [
      { divided: false, chord: "G", exten: "maj6" },
      { divided: true, chord: "G", exten: "maj" },
      { divided: true, chord: "A#/Bb", exten: "dim7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: true, chord: "G", exten: "maj" },
      { divided: true, chord: "A#/Bb", exten: "dim7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "D", exten: "min7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "maj69" },
      { divided: false, chord: "C", exten: "maj69" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: true, chord: "G", exten: "maj" },
      { divided: true, chord: "A#/Bb", exten: "dim7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "D", exten: "min7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "maj69" },
      { divided: false, chord: "C", exten: "maj69" },
      { divided: false, chord: "C", exten: "maj69" },
      { divided: false, chord: "C#/Db", exten: "dim7" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "D", exten: "9" }
    ],
    audio: "I can't give you anything but love Ear App"
  },
  {
    pdf: "St James Infirmary Ear App",
    title: "St James Infirmary Blues",
    key: "D",
    sheet: [
      { divided: true, chord: "D", exten: "min" },
      { divided: true, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: true, chord: "D", exten: "min" },
      { divided: true, chord: "G", exten: "min" },
      { divided: false, chord: "A", exten: "7" },
      { divided: true, chord: "D", exten: "min" },
      { divided: true, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: true, chord: "A#/Bb", exten: "7" },
      { divided: true, chord: "A", exten: "7" },
      { divided: true, chord: "D", exten: "min" },
      { divided: true, chord: "A", exten: "7" }
    ],
    audio: "St James Infirmary Ear App"
  },
  {
    pdf: "Blues 4 Ear App",
    title: "Blues 4",
    key: "Bb",
    sheet: [
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: false, chord: "F", exten: "aug" },
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: false, chord: "A#/Bb", exten: "7" },
      { divided: false, chord: "D#/Eb", exten: "maj" },
      { divided: false, chord: "D#/Eb", exten: "min" },
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "C#/Db", exten: "dim7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "9" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "D#/Eb", exten: "min" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "F", exten: "aug" }
    ],
    audio: "Blues 4 Ear App"
  },
  {
    pdf: "Charleston Ear App",
    title: "Charleston",
    key: "Bb",
    sheet: [
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "F", exten: "7" },
      { divided: false, chord: "C#/Bb", exten: "7" },
      { divided: false, chord: "C#/Bb", exten: "7" },
      { divided: false, chord: "D#/Eb", exten: "69" },
      { divided: false, chord: "D#/Eb", exten: "69" },
      { divided: false, chord: "C#/Bb", exten: "7" },
      { divided: false, chord: "C#/Bb", exten: "7" },
      { divided: false, chord: "D#/Eb", exten: "69" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "F", exten: "9" },
      { divided: true, chord: "A#/Bb", exten: "maj6" },
      { divided: true, chord: "B", exten: "dim7" },
      { divided: true, chord: "C", exten: "min7" },
      { divided: true, chord: "F", exten: "9" }
    ],
    audio: "Charleston Ear App"
  },
  {
    pdf: "Blues mineur Ear App",
    title: "Blues mineur",
    key: "G",
    sheet: [
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "C", exten: "min6" },
      { divided: false, chord: "C", exten: "min6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "D#/Eb", exten: "9" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "D", exten: "9" }
    ],
    audio: "Blues mineur Ear App"
  },

  {
    pdf: "Dark Eyes Ear App",
    title: "Dark Eyes",
    key: "D",
    sheet: [
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "G", exten: "min6" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: true, chord: "D", exten: "min" },
      { divided: true, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" }
    ],
    audio: "Dark Eyes Ear App"
  },

  {
    pdf: "Joseph Joseph Ear App",
    title: "Joseph Joseph",
    key: "A",
    sheet: [
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "F", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min6" },
      { divided: false, chord: "E", exten: "7" }
    ],
    audio: "Joseph Joseph Ear App"
  },

  {
    pdf: "Honeysuckle Rose Ear App",
    title: "Honeysuckle Rose",
    key: "F",
    sheet: [
      { divided: true, chord: "G", exten: "min7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: true, chord: "G", exten: "min7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: false, chord: "G", exten: "min7" },
      { divided: false, chord: "C", exten: "9" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: true, chord: "G#/Ab", exten: "dim7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: true, chord: "F", exten: "maj6" },
      { divided: true, chord: "C", exten: "9" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: true, chord: "G", exten: "min7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: true, chord: "G", exten: "min7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: false, chord: "G", exten: "min7" },
      { divided: false, chord: "C", exten: "9" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: true, chord: "G#/Ab", exten: "dim7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: true, chord: "F", exten: "maj6" },
      { divided: true, chord: "C", exten: "9" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "A#/Bb", exten: "maj6" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "9" },
      { divided: false, chord: "C", exten: "9" },
      { divided: true, chord: "G", exten: "min7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: true, chord: "G", exten: "min7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: false, chord: "G", exten: "min7" },
      { divided: false, chord: "C", exten: "9" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: true, chord: "G#/Ab", exten: "dim7" },
      { divided: true, chord: "C", exten: "9" },
      { divided: true, chord: "F", exten: "maj6" },
      { divided: true, chord: "C", exten: "9" },
      { divided: false, chord: "F", exten: "maj6" }
    ],
    audio: "Honeysuckle Rose Ear App"
  },

  {
    pdf: "The Sheik of Araby Ear App",
    title: "The Sheik of Araby ",
    key: "Bb",
    sheet: [
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "B", exten: "dim7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "7" },
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: false, chord: "C#/Db", exten: "dim7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "7" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "B", exten: "dim7" },
      { divided: true, chord: "C", exten: "min7" },
      { divided: true, chord: "F", exten: "7" },
      { divided: false, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "B", exten: "dim7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: true, chord: "F", exten: "7" },
      { divided: true, chord: "D#/Eb", exten: "7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "C", exten: "min7" },
      { divided: false, chord: "F", exten: "7" },
      { divided: true, chord: "A#/Bb", exten: "maj" },
      { divided: true, chord: "B", exten: "dim7" },
      { divided: true, chord: "C", exten: "min7" },
      { divided: true, chord: "F", exten: "7" }
    ],
    audio: "The Sheik of Araby Ear App"
  }
];

var swingIntermediate = [
  {
    pdf: "China Boy Ear App",
    title: "China Boy",
    key: "F",
    sheet: [
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "A#/Bb", exten: "min" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "F", exten: "maj" },
      { divided: false, chord: "D#/Eb", exten: "7" },
      { divided: false, chord: "G#/Ab", exten: "maj6" },
      { divided: false, chord: "D#/Eb", exten: "7" },
      { divided: false, chord: "G#/Ab", exten: "maj6" },
      { divided: false, chord: "D#/Eb", exten: "7" },
      { divided: false, chord: "G#/Ab", exten: "maj6" },
      { divided: false, chord: "D#/Eb", exten: "7" },
      { divided: false, chord: "G#/Ab", exten: "maj6" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "F", exten: "maj" },
      { divided: false, chord: "F", exten: "maj" },
      { divided: false, chord: "B", exten: "dim7" },
      { divided: false, chord: "B", exten: "dim7" },
      { divided: false, chord: "G", exten: "min7" },
      { divided: false, chord: "C", exten: "7" },
      { divided: false, chord: "F", exten: "maj6" },
      { divided: false, chord: "C", exten: "7" }
    ],
    audio: "China Boy Ear App"
  },

  {
    pdf: "Django's Tiger Ear App",
    title: "Django's Tiger",
    key: "A",
    sheet: [
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "A", exten: "dim7" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "C", exten: "dim7" },
      { divided: false, chord: "E", exten: "9" },
      { divided: false, chord: "E", exten: "9" },
      { divided: false, chord: "E", exten: "9" },
      { divided: false, chord: "E", exten: "9" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "F", exten: "9" },
      { divided: false, chord: "E", exten: "9" },
      { divided: false, chord: "E", exten: "9" },
      { divided: true, chord: "A", exten: "maj6" },
      { divided: true, chord: "A#/Bb", exten: "dim7" },
      { divided: true, chord: "B", exten: "min7" },
      { divided: true, chord: "E", exten: "9" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "G#/Ab", exten: "7" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "69" },
      { divided: false, chord: "D", exten: "69" },
      { divided: false, chord: "D", exten: "69" },
      { divided: false, chord: "D#/Eb", exten: "dim7" },
      { divided: false, chord: "A", exten: "maj6" },
      { divided: false, chord: "F#/Gb", exten: "7" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: true, chord: "A", exten: "maj6" },
      { divided: true, chord: "A#/Bb", exten: "dim7" },
      { divided: true, chord: "B", exten: "min7" },
      { divided: false, chord: "E", exten: "9" }
    ],
    audio: "Django's Tiger Ear App"
  },

  {
    pdf: "Hungaria Ear App",
    title: "Hungaria",
    key: "G",
    sheet: [
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G#/Ab", exten: "maj" },
      { divided: false, chord: "G#/Ab", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "A#/Bb", exten: "dim7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G#/Ab", exten: "maj" },
      { divided: false, chord: "G#/Ab", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "C", exten: "min6" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "E", exten: "7" },
      { divided: false, chord: "A", exten: "min7" },
      { divided: false, chord: "D", exten: "7" },
      { divided: false, chord: "G", exten: "maj" },
      { divided: false, chord: "D", exten: "7" }
    ],
    audio: "Hungaria Ear App"
  },

  {
    pdf: "Nuages Ear App",
    title: "Nuages",
    key: "G",
    sheet: [
      { divided: false, chord: "D#/Eb", exten: "9" },
      { divided: true, chord: "A", exten: "min7b5" },
      { divided: true, chord: "D", exten: "7b9" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "D#/Eb", exten: "9" },
      { divided: true, chord: "A", exten: "min7b5" },
      { divided: true, chord: "D", exten: "7b9" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "F#/Gb", exten: "min7b5" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "E", exten: "min" },
      { divided: false, chord: "E", exten: "min" },
      { divided: true, chord: "A", exten: "7" },
      { divided: true, chord: "G#/Ab", exten: "7" },
      { divided: false, chord: "A", exten: "7" },
      { divided: true, chord: "D", exten: "9" },
      { divided: true, chord: "C#/Db", exten: "9" },
      { divided: false, chord: "D", exten: "9" },
      { divided: false, chord: "D#/Eb", exten: "9" },
      { divided: true, chord: "A", exten: "min7b5" },
      { divided: true, chord: "D", exten: "7b9" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "G#/Ab", exten: "7" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "69" },
      { divided: false, chord: "C", exten: "69" },
      { divided: false, chord: "C", exten: "min6" },
      { divided: false, chord: "C", exten: "min6" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "G", exten: "maj6" },
      { divided: false, chord: "D#/Eb", exten: "9" },
      { divided: true, chord: "A", exten: "min7b5" },
      { divided: true, chord: "D", exten: "7b9" },
      { divided: true, chord: "G", exten: "maj6" },
      { divided: true, chord: "C", exten: "min" },
      { divided: true, chord: "G", exten: "maj6" },
      { divided: true, chord: "D", exten: "7" }
    ],
    audio: "Nuages Ear App"
  },

  {
    pdf: "Seul ce soir Ear App",
    title: "Seul ce soir",
    key: "C",
    sheet: [
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "E", exten: "min7b5" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "B", exten: "7" },
      { divided: true, chord: "E", exten: "min7" },
      { divided: true, chord: "D#/Eb", exten: "min7" },
      { divided: true, chord: "D", exten: "min7" },
      { divided: true, chord: "G", exten: "7" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "B", exten: "7" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "E", exten: "min7b5" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "F", exten: "min6" },
      { divided: false, chord: "C", exten: "maj" },
      { divided: false, chord: "A", exten: "7" },
      { divided: false, chord: "D", exten: "min" },
      { divided: false, chord: "G", exten: "7" },
      { divided: true, chord: "C", exten: "69" },
      { divided: true, chord: "C#/Db", exten: "dim7" },
      { divided: true, chord: "D", exten: "min7" },
      { divided: true, chord: "G", exten: "7" }
    ],
    audio: "Seul ce soir Ear App"
  }
];

swingIntermediate = swingIntermediate.concat(swingBeginner);
