function main() {

    // Make the Message form appear when the SEND MESSAGE button is clicked
    let sendMsgBtn = document.getElementById("send-msg-btn");
    sendMsgBtn.addEventListener("click", function() {

        // Make sure the output area is cleared out before we make the message form appear
        let output = document.getElementById("output");
        output.innerHTML = "";

        let messenger = document.getElementById("messenger-area");
        messenger.style.display = "block";
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
}


function showMessage(type) {

    console.log(type);

    // Make sure the messenger is hidden
    let messenger = document.getElementById("messenger-area");
    messenger.style.display = "none";

    let url = `http://localhost:3000/${type}`;
    console.log(url)

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

        let html = "";
        if (message !== "Message Queue Empty") {
            html = `<p>Agent ${agent_id}: ${message}</p>`
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

    const url = "http://localhost:3000/send/"

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
                let messenger = document.getElementById("messenger-area");
                messenger.style.display = "none";

                // Clear the input fields
                document.getElementById("agent-id").value = "";
                document.getElementById("message").value = "";

                let output = document.getElementById("output");
                output.innerHTML = "Message sent";
            }
        })
    });
}

window.addEventListener("load", main);