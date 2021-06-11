function main() {

    // Make the Message form appear when the SEND MESSAGE button is clicked
    let sendMsgBtn = document.getElementById("send-msg-btn");
    sendMsgBtn.addEventListener("click", function() {

        // Make sure the output area is cleared out before we make the message form appear
        let output = document.getElementById("output");
        output.innerHTML = "";

        toggleMessenger("block");
    });

    // Display some output when Read message links are clicked
    let readLatestBtn = document.getElementById("read-msg-btn");
    readLatestBtn.addEventListener("click", () => {
        showMessage("read");
    });

    let readOldBtn = document.getElementById("read-reverse-btn");
    readOldBtn.addEventListener("click", () => {
        showMessage("old");
    });

    // Send form POST data to node server
    let submitMsgBtn = document.getElementById("submit-message");
    submitMsgBtn.addEventListener("click", sendData);

    // Use InputFilter to make the Agent ID box accept numbers-only
    setInputFilter(document.getElementById("agent-id"), (value) => {
        return /^\d*$/.test(value);
    });

    // Listen for the other decorative buttons
    let chessBtn = document.getElementById("chess-btn");
    let pokerBtn = document.getElementById("poker-btn");
    let warBtn = document.getElementById("war-btn");

    chessBtn.addEventListener("click", () => {
        notAvailable("Chess");
    });

    pokerBtn.addEventListener("click", () => {
        notAvailable("Poker");
    });

    warBtn.addEventListener("click", () => {

        // Hide the messenger
        toggleMessenger("none");

        let warHTML = '<div class="wopr-text">WHICH SIDE DO YOU WANT?</div>';
        warHTML += '<ol class="wopr-text">';
        warHTML += '<li>UNITED STATES</li><li>SOVIET UNION</li></ol>';
        warHTML += '<div class="wopr-text">INSUFFICIENT ACCESS LEVEL TO START GLOBAL WAR<br />PLEASE TRY AGAIN LATER</div>';

        document.getElementById("output").innerHTML = warHTML

    })
}


function toggleMessenger(state) {
    let messenger = document.getElementById("messenger-area");
    messenger.style.display = state;
}


// Output some text for the decorative menu items that don't have actual functionality
function notAvailable(item) {
    // Make sure the messenger is hidden
    toggleMessenger("none");
    document.getElementById("output").innerHTML = `${item} will be available in Q2 1984`;
}


function showMessage(type) {

    // Make sure the messenger is hidden
    toggleMessenger("none");

    let baseurl = window.location.hostname
    let url = `http://${baseurl}:3000/${type}`;

    fetch(url).
    then((resp) => resp.json())
    .then(function(data) {

        let message;
        try {
            message = data[0]["message"];
        } catch {
            message = "Message Queue Empty"
        }

        let agent_id;
        try {
            agent_id = data[0]["agent_id"];
        } catch {
            agent_id = 42;
        }

        let codename;
        try {
            codename = data[0]["codename"];
        } catch {
            codename = "Null";
        }

        let html = "";
        if (message !== "Message Queue Empty") {
            html = `<p>Agent ${codename}: ${message}</p>`
            html += "<p>* Message deleted *</p>"
        } else {
            html = message;
        }

        let output = document.getElementById("output");
        output.innerHTML = html;

    })
    .catch(function(error) {
        console.log(error);
    });
}


function sendData() {

    let baseurl = window.location.hostname
    let url = `http://${baseurl}:3000/send`;

    // Get the secret agent ID and message inputs
    let agentID = document.getElementById("agent-id").value;
    let message = document.getElementById("message").value;

    // Create an object with our super secret data
    let data = {
        "agent": agentID,
        "message": message
    }

    // Send the proper POST request to the node server
    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            agent: agentID,
            message: message
        })
    })
    .then(response => {

        // Check the server's response text
        response.text().then(text => {
            console.log(text)
            if (text === "Message added") {

                // Hide the messenger area
                toggleMessenger("none");

                // Clear the input fields
                document.getElementById("agent-id").value = "";
                document.getElementById("message").value = "";

                let output = document.getElementById("output");
                output.innerHTML = "Message sent";
            }
        })
    });
}


// Restricts input for the given textbox to the given inputFilter.
// Thanks to emkey08 on jsfiddle.net for this function.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }

window.addEventListener("load", main);