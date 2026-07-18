document.addEventListener("DOMContentLoaded", () => {

    const activeButton = document.getElementById('activate');

    const port = chrome.runtime.connect({ name: "START" }); 

    function sendMessage() {
        port.postMessage({
            message: "START"    
        });
        console.log("message posted")
    }

    activeButton.addEventListener('click', sendMessage)
});