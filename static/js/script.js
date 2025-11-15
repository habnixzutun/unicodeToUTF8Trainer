document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-item');

  tabs.forEach(clickedTab => {
    clickedTab.addEventListener('click', (e) => {
      e.preventDefault();

      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      clickedTab.classList.add('active');
      var tmp = mode;
      switch (clickedTab.textContent) {
        case "UniToUTF8":
            mode = 1;
            binInput.placeholder = "Binärzahl eingeben... ";
            break;
      }
      if (tmp != mode) {
        refreshValue(bytes);
        binInput.value = "";
      }
      console.log(mode);
    });
  });
      const binInput = document.getElementById('bin-input');
      const hexInput = document.getElementById('hex-input');
      const unicodeOutput = document.getElementById('unicode-output');
      const sendButton = document.getElementById('send-button');
      const byteAmount = document.getElementById('bit-amount');
      const increaseButton = document.getElementById('increase-bytes');
      const decreaseButton = document.getElementById('decrease-bytes');
      const correctCounter = document.getElementById('correct-counter');
      const wrongCounter = document.getElementById('wrong-counter');
      const pointsCounter = document.getElementById('points-counter');
      const nameInput = document.getElementById("name-input");
      const nameButton = document.getElementById("name-button");
      const leaderboardReloader = document.getElementById("leaderboard-reloader");
      const url = new URL(location.href);
      console.log(url)

      var mode = 1;
      var bytes = 4;
      const minBytes = 4;
      const maxBytes = 32;

      if (nameInput.value) {
        sendName();
      }

      function randomIntFromInterval(min, max) { // min and max included
         return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function refreshValue(bytes) {
        return;
      }

      increaseButton.addEventListener('click', () => {
        bytes++;
        if (bytes > maxBytes) {
            bytes = maxBytes;
            alert("Du kannst nicht mehr als " + maxBytes + " Bytes auswählen");
            refreshValue(bytes);
        }
        else {
            refreshValue(bytes);
        }

      });

      decreaseButton.addEventListener('click', () => {
              bytes--;
              if (bytes < minBytes) {
                  bytes = minBytes;
                  alert("Du kannst nicht weniger als " + minBytes + " Bytes auswählen");
              }
              else {
                  refreshValue(bytes);
              }
      });

      leaderboardReloader.addEventListener('click', () => {
          window.location.reload();
      });

      function increaseCorrect() {
          correctCounter.textContent = parseInt(correctCounter.textContent) + 1;
          pointsCounter.textContent = parseInt(pointsCounter.textContent) + bytes * 8;
      }

      function increaseWrong() {
          wrongCounter.textContent = parseInt(wrongCounter.textContent) + 1;
          pointsCounter.textContent = parseInt(pointsCounter.textContent) - 4 * bytes * 8;
      }

      function check_io_overlap_mode1() {
        return false;
      }

      // Live-Umrechnung (bleibt wie zuvor)
      binInput.addEventListener('input', () => {
           switch (mode) {
                case 1:
                    var binaryValue = binInput.value.replace(/[^01]/g, '');
                    binInput.value = binaryValue;
                    break;
            }


      });

      // Event-Listener für den Sende-Button (ruft jetzt nur die Funktion auf)
      sendButton.addEventListener('click', () => refreshValue(bytes));

      // NEU: Event-Listener für Tastendrücke im Eingabefeld
      binInput.addEventListener('keydown', (event) => {
          // Prüfen, ob die gedrückte Taste "Enter" ist
          if (event.key === 'Enter') {
              // Verhindert das Standardverhalten (z.B. Formular-Absenden, das einen Reload auslöst)
              event.preventDefault();

                switch (mode) {
                    case 1:
                         if (check_io_overlap_mode1()) {
                             increaseCorrect();
                             sendData();
                         }
                         else {
                             increaseWrong();
                             sendData();
                             alert("Wrong! " + "");
                         }
                         binInput.value = "";
                         break;
                }


              refreshValue(bytes);
          }
      });

      nameInput.addEventListener('keydown', (event) => {
          // Prüfen, ob die gedrückte Taste "Enter" ist
          if (event.key === 'Enter') {
              // Verhindert das Standardverhalten (z.B. Formular-Absenden, das einen Reload auslöst)
              event.preventDefault();
              sendName();
          }
      });

      nameButton.addEventListener("click", () => {
        sendName();
      });

      async function sendName() {
        console.log('Sende Name:', {name: nameInput.value});
              try {
                  console.log(url.href + '/name');
                  const response = await fetch(url.href + '/name', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                                             name: nameInput.value,
                                             prev_correct: parseInt(correctCounter.textContent),
                                             prev_wrong: parseInt(wrongCounter.textContent),
                                             len: bytes
                                             })
                  });

                  const result = await response.json();
                  console.log('Antwort vom Server:', result);
                  if (response.ok) {
                      correctCounter.textContent = result.correct;
                      wrongCounter.textContent = result.wrong;
                      pointsCounter.textContent = result.points;
                      binInput.removeAttribute("disabled");
                      nameInput.setAttribute("disabled", "disabled");
                      nameButton.setAttribute("disabled", "disabled");
                  }


              } catch (error) {
                  console.error('Fehler beim Senden der Daten:', error);
                  //alert('Fehler: Konnte das Backend nicht erreichen.');
              }
      }

      async function sendData() {
              if (nameInput.value == "") {
                    alert("Bitte einen Namen eingeben");
              }

              console.log('Sende Daten:', { len: bytes,
                                            name: nameInput.value,
                                            right: parseInt(correctCounter.textContent),
                                            incorrect: parseInt(wrongCounter.textContent),
                                            name: nameInput.value,
                                            trainMode: mode});

              try {
                  console.log(url.href + '/data');
                  const response = await fetch(url.href + '/data', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                                             name: nameInput.value,
                                             len: bytes,
                                             right: parseInt(correctCounter.textContent),
                                             incorrect: parseInt(wrongCounter.textContent),
                                             name: nameInput.value,
                                            trainMode: mode
                                             })
                  });

                  const result = await response.json();
                  console.log('Antwort vom Server:', result);
                  if (response.ok) {
                      correctCounter.textContent = result.correct;
                      wrongCounter.textContent = result.wrong;
                      pointsCounter.textContent = result.points;
                  }

              } catch (error) {
                  console.error('Fehler beim Senden der Daten:', error);
                  //alert('Fehler: Konnte das Backend nicht erreichen.');
              }
          }

       refreshValue(bytes);
});