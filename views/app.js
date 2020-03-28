document.addEventListener("DOMContentLoaded", () => {
  var max_record;

  var status = document.getElementById("status");
  var online = document.getElementById("online");
  var sendForm = document.getElementById("send-form");
  var content = document.getElementById("content");
  var nameInputBox = document.getElementById("name");
  var name = getCookie("name");

  if (name) {
    nameInputBox.value = name;
  }

  socket.on("connect", function () {
    status.innerText = "Connected.";
  });

  socket.on("disconnect", function () {
    status.innerText = "Disconnected.";
  });

  socket.on("online", function (amount) {
    online.innerText = amount;
  });

  socket.on("maxRecord", function (amount) {
    max_record = amount;
  });

  socket.on("chatRecord", function (msgs) {
    for (var i = 0; i < msgs.length; i++) {
      (function () {
        addMsgToBox(msgs[i]);
      })();
    }
  });

  socket.on("msg", addMsgToBox);

  sendForm.addEventListener("submit", function (e) {
    e.preventDefault();


    var ok = true;
    var formData = {
      time: new Date().toUTCString()
    };
    var formChild = sendForm.children;

    for (var i = 0; i < sendForm.childElementCount; i++) {
      var child = formChild[i];
      if (child.name !== "") {
        var val = child.value;
        if (val === "" || !val) {
          ok = false;
          child.classList.add("error");
        } else {
          child.classList.remove("error");
          formData[child.name] = val;
          console.log(child.name);
          console.log(val);
        }
      }
    }

    if (ok) {
      //var child = formChild[1];
      //child.name = "msg";
      formData["msg"] = (getRandom(1, 6));
      console.log(getRandom(1, 6));
      socket.emit("send", formData);
      setCookie("name", nameInputBox.value);
    }
  });

  function addMsgToBox(d) {
    var msgBox = document.createElement("div")
    msgBox.className = "msg";
    var nameBox = document.createElement("span");
    nameBox.className = "name";
    var name = document.createTextNode(d.name);
    var msg = document.createTextNode(d.msg);

    nameBox.appendChild(name);
    msgBox.appendChild(nameBox);
    msgBox.appendChild(msg);
    content.appendChild(msgBox);

    if (content.children.length > max_record) {
      rmMsgFromBox();
    }
  }

  function rmMsgFromBox() {
    var childs = content.children;
    childs[0].remove();
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});


function rollDice() {
  const dice = [...document.querySelectorAll(".die-list")];
  dice.forEach(die => {
    toggleClasses(die);
    die.dataset.roll = getRandomNumber(1, 6);
  });
}

function toggleClasses(die) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("roll-button").addEventListener("click", rollDice);
