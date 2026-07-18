// chrome.runtime.onConnect.addListener(function(port) {
//   if (port.name === "START") {
//     port.onMessage.addListener(function(msg) {
//       console.log("Message received: ", msg.greeting);
//       injectMainWorld(tabId);
    
//     });
//   }
// });



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) injectMainWorld(tabId);
});


async function injectMainWorld(tabId) {
  console.log("injectMainWorld hello1", tabId)
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["inject.js"],
    world: "MAIN"
  });
}