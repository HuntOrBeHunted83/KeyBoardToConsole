document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Select the DOM elements once when the page loads
    const profile = document.getElementById("profile");
    const DPadUp = document.getElementById("DPadUp");
    const DPadDown = document.getElementById("DPadDown");
    const DPadLeft = document.getElementById("DPadLeft");
    const DPadRight = document.getElementById("DPadRight");
    const saveButton = document.getElementById("save");

    // 2. Open the Chrome runtime connection port
    const port = chrome.runtime.connect({ name: "sendVariableValues" }); 

    function sendMessage() {
        const profileName = profile.value.trim();

        if (!profileName) {
            alert("Please enter a profile name.");
            return;
        }
        // if (!DPadUp.value || !DPadDown.value || !DPadLeft.value || !DPadRight.value) {
        //     alert("Please fill in all D-Pad bindings.");
        //     return;
        // }

        port.postMessage({
            profile: profileName,
            DPadUp: DPadUp.value,
            DPadDown: DPadDown.value,
            DPadLeft: DPadLeft.value,
            DPadRight: DPadRight.value
        });
        console.log("message posted");
    }

    saveButton.addEventListener('click', sendMessage);

});