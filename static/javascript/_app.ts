const attributeBlock = "x-block";
const attributeImport = "x-import";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function importBlocks(component: Element): String {
  let blockInnerHTML = component.innerHTML;
  return blockInnerHTML;
}

function importComponents() {
  const elements = document.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    const file = element.getAttribute(attributeImport);

    // file = file.endsWith(".html") ? file : (file += ".html");

    if (file) {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState == 4) {
          const debugInfo = `<!-- Component imported from '${file}' -->\n`;

          if (this.status == 200) {
            console.log(importBlocks(element));

            const componentInnerHTML = this.responseText;
            const lastTagIndex = componentInnerHTML.lastIndexOf("</");
            const closingTag = componentInnerHTML.slice(lastTagIndex);

            const embededComponentInnerHTML =
              this.responseText.slice(0, lastTagIndex) +
              element.innerHTML +
              closingTag;

            element.innerHTML =
              debugInfo + embededComponentInnerHTML + element.innerHTML;
          }
          if (this.status == 404) {
            element.innerHTML = debugInfo + "Component not found.";
          }

          element.removeAttribute(attributeImport);
          importComponents();
        }
      };
      request.open("GET", file, true);
      request.send();
      return;
    }
  }
}

function validateEmail(email): Boolean {
  return emailRegex.test(email);
}

function waitForElement(elementQuery: Function, callBack: Function) {
  function worker() {
    const element: Element = elementQuery();

    if (element) {
      callBack(element);
    } else {
      setTimeout(worker, 1);
    }
  }

  worker();
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

function sendMessage(message: String) {}
