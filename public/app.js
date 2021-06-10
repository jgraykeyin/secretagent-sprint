function main() {

    // Make the Message form appear when the SEND MESSAGE button is clicked
    let sendMsgBtn = document.getElementById("send-msg-btn");
    sendMsgBtn.addEventListener("click", function() {

        let messenger = document.getElementById("messenger-area");
        messenger.style.display = "block";
    });

    // Send form POST data to node server
    let submitMsgBtn = document.getElementById("submit-message");
    submitMsgBtn.addEventListener("click", sendData);
}


function sendData() {

    let agentID = document.getElementById("agent-id").value;
    let message = document.getElementById("message").value;

    let data = {
        "agent": agentID,
        "message": message
    }

    // Send the proper POST request to the node server
    fetch("http://192.168.2.28:3000/send/", {
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

        response.text().then(text => {
            console.log(text)
            if (text === "Message added") {
                let messenger = document.getElementById("messenger-area");
                messenger.style.display = "none";

                let output = document.getElementById("output");
                output.innerHTML = "Message sent";
            }
        })
    });
}

window.addEventListener("load", main);