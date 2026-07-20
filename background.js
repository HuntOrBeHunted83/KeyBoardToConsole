async function injectMainWorld(tabId) {
  console.log("injectMainWorld hello1", tabId);
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["inject.js"],
    world: "MAIN"
  });
}

async function setStorageLocal(items) {
  try {
    await chrome.storage.local.set(items);
  } catch (error) {
    console.error("Failed to save data to local storage:", error, chrome.runtime.lastError);
  }
}

async function getStorageLocal(key) {
  try {
    const values = await chrome.storage.local.get(key);
    if (values && key in values) {
      return values[key];
    }
    return null;
  } catch (error) {
    console.error("Failed to get data from local storage:", error, chrome.runtime.lastError);
    return null;
  }
}

async function removeStorageLocal(items) {
  try {
    await chrome.storage.local.remove(items);
  } catch (error) {
    console.error("Failed to remove data from local storage:", error);
  }
}

let customProfile = {};

let defaultProfile = {
  profileName: "default1",
  bindings: {
    KeyI: 0,  // A, B, X, Y
    KeyJ: 1,
    KeyK: 2,
    KeyL: 3,

    ArrowUp: 12,
    ArrowLeft: 13,
    ArrowDown: 14,
    ArrowRight: 15,

    KeyT: 4,
    KeyF: 5,
    KeyG: 6,
    KeyH: 7,

    KeyZ: 8,
    KeyX: 9,
    KeyC: 10,
    KeyV: 11,
    KeyM: 16
  },
  sensitivity: 0.5
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    injectMainWorld(tabId);
  }

  
  const existingDefault = await getStorageLocal(defaultProfile.profileName);
  if (existingDefault === null) {
    await setStorageLocal({ [defaultProfile.profileName]: defaultProfile });
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "sendVariableValues") return;

  port.onMessage.addListener(async (msg) => {
    const profileName = (msg.profile || "").trim();
    const DPadUp = msg.DPadUp;
    const DPadDown = msg.DPadDown;
    const DPadLeft = msg.DPadLeft;
    const DPadRight = msg.DPadRight;

    if (!profileName) {
      console.error("Profile name is required; ignoring message.");
      return;
    }
    // if (!DPadUp || !DPadDown || !DPadLeft || !DPadRight) {
    //   console.error("All D-Pad bindings are required; ignoring message.");
    //   return;
    // }

    console.log("Received data for profile:", profileName);

   
    const savedProfile = await getStorageLocal(profileName);

    if (savedProfile !== null) {
      
      console.log("Loaded existing profile:", savedProfile);
    } else {
      // Create new profile
      customProfile[profileName] = {
        name: profileName,
        bindings: {
          [DPadUp]: 12,
          [DPadDown]: 13,
          [DPadLeft]: 14,
          [DPadRight]: 15,
        },
      };

      await setStorageLocal({ [profileName]: customProfile[profileName] });
      console.log("Created and saved new profile:", customProfile[profileName]);
    }

    console.log("Updated customProfile:", customProfile);
  });
});