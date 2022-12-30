function waitForElement(elementQuery, callback) {
  function worker() {
    const element = elementQuery();

    if (element) {
      callback(element);
    } else {
      setTimeout(worker, 1);
    }
  }

  worker();
}

function includeHTML() {
  const attributeLabel = "x-import";
  const elements = document.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    const file = element.getAttribute(attributeLabel);

    if (file) {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            element.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            element.innerHTML = "Component not found.";
          }
          element.removeAttribute(attributeLabel);
          includeHTML();
        }
      };
      request.open("GET", file, true);
      request.send();
      return;
    }
  }
}

function getSessionData() {
  return {
    username: sessionStorage.getItem("session-data-username"),
    profilePictureURL: sessionStorage.getItem("session-data-profilePictureURL"),
  };
}

function checkLoginSession() {
  const sessionStatus = sessionStorage.getItem("session-data-status");
  console.log("checking session status " + sessionStatus);

  if (sessionStatus != null && sessionStatus == "active") {
    const { username, profilePictureURL } = getSessionData();

    waitForElement(
      () => document.getElementById("x-data-user__profile__picture"),
      (e) => (e.src = profilePictureURL),
    );

    waitForElement(
      () => document.getElementById("x-data-username"),
      (e) => (e.innerHTML = username),
    );
  }
}

function validateAuthData(data) {
  const userData = {
    data: data,
    profilePictureURL: "https://github.com/ItsYasiru.png",
  };
  // make a request to the server API and actually validate the data later

  return { valid: true, userData: userData };
}

function authenticateSession(username, password) {
  const authData = {
    username: username,
    password: password,
    timestamp: new Date().getTime(),
  };

  const { valid, userData } = validateAuthData(authData);

  console.log("setting " + valid);
  if (valid) {
    // dummy data for now
    sessionStorage.setItem("session-data-status", "active");
    sessionStorage.setItem("session-data-username", username);
    sessionStorage.setItem(
      "session-data-profilePictureURL",
      userData.profilePictureURL,
    );
  }
}

function loginFormSubmit(event) {
  console.log(event);
}
