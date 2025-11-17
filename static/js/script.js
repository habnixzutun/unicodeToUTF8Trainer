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
            binUnicodeInput.placeholder = "Unicode in Binär eingeben";
            binInput.placeholder = "UTF-8 in Binär eingeben (z.B. 11001010 10011001)";
            hexInput.placeholder = "UTF-8 in Hex eingeben (z.B. CA 99)";
            break;
        case "HexToBinTrainer":
            window.location.replace("https://server.albecker.eu/hextobin");
            break;
      }
      if (tmp != mode) {
        refreshValue(bytes);
        binInput.value = "";
      }
      console.log(mode);
    });
  });
      const binUnicodeInput = document.getElementById('bin-unicode-input');
      const binInput = document.getElementById('bin-input');
      const hexInput = document.getElementById('hex-input');
      const unicodeOutput = document.getElementById('unicode-output');
      const sendButton = document.getElementById('send-button');
      const byteAmount = document.getElementById('byte-amount');
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
      var bytes = 3;
      const minBytes = 1;
      const maxBytes = 4;

      window.addEventListener('load', function () {
          if (localStorage.getItem("bytes")) {
              if (parseInt(localStorage.getItem("bytes")) != bytes) {
                  byteAmount.textContent = localStorage.getItem("bytes");
                  bytes = parseInt(localStorage.getItem("bytes"));
                  refreshValue(bytes);
              }
          }
          else {
              byteAmount.textContent = bytes;
          }
          if (localStorage.getItem("name")) {
            if (localStorage.getItem("name") != nameInput.value) {
                nameInput.value = localStorage.getItem("name");
                sendName();
              }
          }
      })


      if (nameInput.value) {
        sendName();
      }

      function randomIntFromInterval(min, max) { // min and max included
         return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function refreshValue(bytes) {
        switch (bytes) {
            case 4:
                var decimalValue = randomIntFromInterval(Math.pow(2, 17), 1112064); // 1112064 ist the max valid unicode codepoint
                break;
            case 3:
                var decimalValue = randomIntFromInterval(Math.pow(2, 12), Math.pow(2, 16));
                break;
            case 2:
                var decimalValue = randomIntFromInterval(Math.pow(2, 8), Math.pow(2, 11));
                break;
            case 1:
                var decimalValue = randomIntFromInterval(0, Math.pow(2, 7));
                break;
        }
        var binUnicode = decimalValue.toString(2);
        var hexUnicode = decimalValue.toString(16).toUpperCase();
        console.log(binUnicode, "bin");
        unicodeOutput.textContent = "U+" + hexUnicode;
        var binUTF8 = convertUnicodeToBinUTF8(hexUnicode);
        var hexUTF8 = convertBinUTF8ToHexUTF8(binUTF8);
        console.log("UTF8: " + binUTF8);
        console.log("UTF8: " + hexUTF8.join(" "));


        return;
      }

      function convertUnicodeToBinUTF8(hexUnicode) {
        binUnicode = parseInt(hexUnicode, 16).toString(2);
        var utf8 = "";
        switch (bytes) {
            case 4:
                binUnicode = binUnicode.padStart(21, "0");
                utf8 += "11110" + binUnicode.substring(0, 3);
                utf8 += " 10" + binUnicode.substring(3, 9);
                utf8 += " 10" + binUnicode.substring(9, 15);
                utf8 += " 10" + binUnicode.substring(15, 21);
                break;
            case 3:
                binUnicode = binUnicode.padStart(16, "0");
                utf8 += "1110" + binUnicode.substring(0, 4);
                utf8 += " 10" + binUnicode.substring(4, 10);
                utf8 += " 10" + binUnicode.substring(10, 16);
                break;
            case 2:
                binUnicode = binUnicode.padStart(11, "0");
                utf8 += "110" + binUnicode.substring(0, 5);
                utf8 += " 10" + binUnicode.substring(5, 11);
                break;
            case 1:
                binUnicode = binUnicode.padStart(8, "0");
                utf8 = binUnicode;
                break;
        }
        return utf8
      }

      function convertBinUTF8ToHexUTF8(binUTF8) {
        var inArray = binUTF8.split(" ");
        var outArray = new Array();
        for (var i = 0; i < inArray.length; i++) {
            outArray[i] = parseInt(inArray[i], 2).toString(16).toUpperCase();
        }
        return outArray;
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
            localStorage.setItem("bytes", bytes);
        }
        byteAmount.textContent = bytes;

      });

      decreaseButton.addEventListener('click', () => {
              bytes--;
              if (bytes < minBytes) {
                  bytes = minBytes;
                  alert("Du kannst nicht weniger als " + minBytes + " Bytes auswählen");
              }
              else {
                  refreshValue(bytes);
                  localStorage.setItem("bytes", bytes);
              }
              byteAmount.textContent = bytes;
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
        var hexUnicode = unicodeOutput.textContent.replace("U+", "");
        var binUnicode = parseInt(hexUnicode, 16).toString(2);
        var binUTF8 = convertUnicodeToBinUTF8(hexUnicode);
        var hexUTF8 = convertBinUTF8ToHexUTF8(binUTF8);


        if (parseInt(binUnicodeInput.value.replaceAll(" ", ""), 2) != parseInt(binUnicode, 2)) return false;
        if (parseInt(binInput.value.replaceAll(" ", ""), 2) != parseInt(binUTF8.replaceAll(" ", ""), 2)) return false;
        if (parseInt(hexInput.value.replaceAll(" ", ""), 16) != parseInt(hexUTF8.join(""), 16)) return false;
        return true
      }

      // Live-Umrechnung (bleibt wie zuvor)
      binUnicodeInput.addEventListener('input', () => {
           switch (mode) {
                case 1:
                    var binaryValue = binUnicodeInput.value.replace(/[^01 ]/g, '');
                    // add separator
                    //binaryValue = binaryValue.replace(/\s/g, ' ');
                    //binaryValue = binaryValue.replace(/\B(?=(?:.{8})+$)/g, ' ');
                    binUnicodeInput.value = binaryValue;
                    break;
            }

      });

      // Live-Umrechnung (bleibt wie zuvor)
      binInput.addEventListener('input', () => {
           switch (mode) {
                case 1:
                    var binaryValue = binInput.value.replace(/[^01 ]/g, '');
                    // add separator
                    //binaryValue = binaryValue.replace(/\s/g, ' ');
                    //binaryValue = binaryValue.replace(/\B(?=(?:.{8})+$)/g, ' ');
                    binInput.value = binaryValue;
                    break;
            }

      });

      // Live-Umrechnung (bleibt wie zuvor)
      hexInput.addEventListener('input', () => {
           switch (mode) {
                case 1:
                    var hexValue = hexInput.value.toUpperCase().replace(/[^0123456789ABCDEF ]/g, '');
                    //hexValue = hexValue.replace(/\s/g, ' ');
                    //hexValue = hexValue.replace(/\B(?=(?:.{2})+$)/g, ' ');
                    hexInput.value = hexValue;
                    break;
            }

      });


      sendButton.addEventListener('click', () => {
            switch (mode) {
                case 1:
                    if (check_io_overlap_mode1()) {
                        increaseCorrect();
                        sendData();
                    }
                    else {
                        var hexUnicode = unicodeOutput.textContent.replace("U+", "");
                        var binUnicode = parseInt(hexUnicode, 16).toString(2);
                        var binUTF8 = convertUnicodeToBinUTF8(hexUnicode);
                        var hexUTF8 = convertBinUTF8ToHexUTF8(binUTF8);

                        increaseWrong();
                        sendData();
                        var wrongMessage = "";
                        wrongMessage += "\nUnicode: U+" + hexUnicode;
                        wrongMessage += "\nBin Unicode: 0b" + binUnicode;
                        wrongMessage += "\nBin UTF-8: 0b" + binUTF8.replaceAll(" ", " 0b");
                        wrongMessage += "\nHex Unicode: 0x" + hexUTF8.join(" 0x");
                        wrongMessage += "\n\n0x / 0b bitte nicht eingeben\nLeerzeichen werden ignoriert"

                        alert("Wrong" + wrongMessage);
                        console.log(parseInt(binUnicodeInput.value.replaceAll(" ", ""), 2), parseInt(binUnicode, 2));
                    }
                    break;
            }
            refreshValue(bytes);
            binUnicodeInput.value = "";
            binInput.value = "";
            hexInput.value = "";
      });

      nameInput.addEventListener('keydown', (event) => {
          // Prüfen, ob die gedrückte Taste "Enter" ist
          if (event.key === 'Enter') {
              event.preventDefault();
              localStorage.setItem("name", nameInput.value)
              sendName();
          }
      });

      nameButton.addEventListener("click", () => {
        localStorage.setItem("name", nameInput.value)
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
                                             len: bytes * 8
                                             })
                  });

                  const result = await response.json();
                  console.log('Antwort vom Server:', result);
                  if (response.ok) {
                      correctCounter.textContent = result.correct;
                      wrongCounter.textContent = result.wrong;
                      pointsCounter.textContent = result.points;
                      binInput.removeAttribute("disabled");
                      binUnicodeInput.removeAttribute("disabled");
                      hexInput.removeAttribute("disabled");
                      sendButton.removeAttribute("disabled");
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
              localStorage.setItem("name", nameInput.value);

              console.log('Sende Daten:', { len: bytes * 8,
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
                                             len: bytes * 8,  // bytes back to bits
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