var attributeBlock = "x-block";
var attributeImport = "x-import";
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function importBlocks(component) {
    var blockInnerHTML = component.innerHTML;
    return blockInnerHTML;
}
function importComponents() {
    var elements = document.getElementsByTagName("*");
    var _loop_1 = function () {
        var element = elements[i];
        var file = element.getAttribute(attributeImport);
        // file = file.endsWith(".html") ? file : (file += ".html");
        if (file) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.readyState == 4) {
                    var debugInfo = "<!-- Component imported from '".concat(file, "' -->\n");
                    if (this.status == 200) {
                        console.log(importBlocks(element));
                        var componentInnerHTML = this.responseText;
                        var lastTagIndex = componentInnerHTML.lastIndexOf("</");
                        var closingTag = componentInnerHTML.slice(lastTagIndex);
                        var embededComponentInnerHTML = this.responseText.slice(0, lastTagIndex) +
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
            return { value: void 0 };
        }
    };
    for (var i = 0; i < elements.length; i++) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
function validateEmail(email) {
    return emailRegex.test(email);
}
function waitForElement(elementQuery, callBack) {
    function worker() {
        var element = elementQuery();
        if (element) {
            callBack(element);
        }
        else {
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
    var sessionStatus = sessionStorage.getItem("session-data-status");
    console.log("checking session status " + sessionStatus);
    if (sessionStatus != null && sessionStatus == "active") {
        var _a = getSessionData(), username_1 = _a.username, profilePictureURL_1 = _a.profilePictureURL;
        waitForElement(function () { return document.getElementById("x-data-user__profile__picture"); }, function (e) { return (e.src = profilePictureURL_1); });
        waitForElement(function () { return document.getElementById("x-data-username"); }, function (e) { return (e.innerHTML = username_1); });
    }
}
function validateAuthData(data) {
    var userData = {
        data: data,
        profilePictureURL: "https://github.com/ItsYasiru.png",
    };
    // make a request to the server API and actually validate the data later
    return { valid: true, userData: userData };
}
function authenticateSession(username, password) {
    var authData = {
        username: username,
        password: password,
        timestamp: new Date().getTime(),
    };
    var _a = validateAuthData(authData), valid = _a.valid, userData = _a.userData;
    console.log("setting " + valid);
    if (valid) {
        // dummy data for now
        sessionStorage.setItem("session-data-status", "active");
        sessionStorage.setItem("session-data-username", username);
        sessionStorage.setItem("session-data-profilePictureURL", userData.profilePictureURL);
    }
}
function loginFormSubmit(event) {
    console.log(event);
}
//# sourceMappingURL=_app.js.map