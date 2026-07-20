const originalGetGamepads = navigator.getGamepads.bind(navigator);
const VIRTUAL_INDEX = 0;
const buttons = Array.from({ length: 17 }, () => mkButton(false, 0));
const SENSITIVITY = 0.1; 
const keyPressTime = new Map();
const pressedKeys = new Set();
const MAX_TIME = 300; 
const MIN_TIME = 80;

const LEFT_STICK_KEYS = {
  KeyW: { axis: "ly", sign: -1 },
  KeyS: { axis: "ly", sign: +1 },
  KeyA: { axis: "lx", sign: -1 },
  KeyD: { axis: "lx", sign: +1 }
};


const input = {
    keys: new Set(),
    mouseDx: 0,
    mouseDy: 0,
    buttons: Object.create(null),
    axes: {
      lx: 0,
      ly: 0,
      rx: 0,
      ry: 0,
      lt: 0,
      rt: 0
    }
  };


const keyToConsoleMapping = {
    KeyI: 0, //A, B,X, Y
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


}


function getHeldDuration(key) {
  const start = keyPressTime.get(key);
  if (start === undefined) return 0;
  return performance.now() - start; // ms
}

function getHeldValue(key) {
  const duration = getHeldDuration(key);
  if (duration <= MIN_TIME) return 0;
  if (duration >= MAX_TIME) return 1;
  // Normalize to 0–1, clamp at 1
   return (duration - MIN_TIME) / (MAX_TIME - MIN_TIME);
}

function updateLeftStick() {
  let lx = 0;
  let ly = 0;

  for (const [code, { axis, sign }] of Object.entries(LEFT_STICK_KEYS)) {
    if (!pressedKeys.has(code)) continue; // skip keys not held

    const value = getHeldValue(code) * sign; // apply direction

    if (axis === "lx") {
      lx += value;
    } else if (axis === "ly") {
      ly += value;
    }
  }

  // Clamp to [-1, 1]
  input.axes.lx = Math.max(-1, Math.min(1, lx));
  input.axes.ly = Math.max(-1, Math.min(1, ly));

  console.log("left stick", input.axes.lx, input.axes.ly, "pressed:", [...pressedKeys]);
}



let isPointerLocked = false;

document.addEventListener("click", async () => {
  try {
      await document.body.requestPointerLock();
      console.log("Pointer lock requested");
    } catch (err) {
      console.error("Pointer lock failed:", err);
    }
});


document.addEventListener("pointerlockchange", () => {
  isPointerLocked = (document.pointerLockElement === document.body || document.pointerLockElement === document.documentElement);
  console.log("pointerlockchange", isPointerLocked);

  if (!isPointerLocked) {
    input.axes.rx = 0;
    input.axes.ry = 0;
  }
});


document.addEventListener("mousemove", (e) => {
  console.log("mousemove", document, document.pointerLockElement)
  let dx = 0
  let dy = 0
  if (!isPointerLocked) {
    return;
  }
  const distance = Math.hypot(e.movementX, e.movementY); // magnitude of the distance 
  if (distance !== 0) {
    const analogForce = Math.tanh(distance * SENSITIVITY);
    
      dx = (e.movementX / distance) * analogForce;
      dy = (e.movementY / distance) * analogForce;
  }

  input.axes.rx = dx; 
  input.axes.ry = dy;
  console.log("mousemove", dx, dy)
});




  navigator.getGamepads = function () {
    const pads = originalGetGamepads() || [];
    const copy = Array.from(pads);
    copy[VIRTUAL_INDEX] = makeGamepad();

    return copy;
  };

  

  const binds = {
    KeyW: "LY-",
    KeyS: "LY+",
    KeyA: "LX-",
    KeyD: "LX+",
    Space: "A",
    ShiftLeft: "L3"
  };

  const buttonMap = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    Back: 8,
    Start: 9,
    L3: 10,
    R3: 11,
    DPadUp: 12,
    DPadDown: 13,
    DPadLeft: 14,
    DPadRight: 15,
    Guide: 16
  };


  function mkButton(pressed, value) {
    return {
      pressed: !!pressed,
      touched: !!pressed,
      value: value
    };
  }

  function makeGamepad() {

    updateLeftStick()

    return {
      id: "Ishank Xbox Controller",
      index: VIRTUAL_INDEX,
      connected: true,
      mapping: "standard",
      timestamp: performance.now(),
      axes: [
        input.axes.lx,
        input.axes.ly,
        input.axes.rx,
        input.axes.ry
      ],
      buttons,
      vibrationActuator: undefined,
      hapticActuators: undefined,
      pose: null,
      hand: ""
    };
  }

window.addEventListener("keydown", (e) => {
  const index = keyToConsoleMapping[e.code];
  if (index !== undefined) {
    buttons[index] = mkButton(true, 1);
    console.log("keyDown", e.code, index, buttons[index]);
  }

  if (e.key === "Escape") {
    document.exitPointerLock();
    isPointerLocked = false;
    input.axes.rx = 0;
    input.axes.ry = 0;
  }

  // Only track left-stick keys
  if (e.code in LEFT_STICK_KEYS) {
    if (!pressedKeys.has(e.code)) {
      pressedKeys.add(e.code);
      keyPressTime.set(e.code, performance.now());
    }
  }
}, true);

window.addEventListener("keyup", (e) => {
  const index = keyToConsoleMapping[e.code];
  if (index !== undefined) {
    buttons[index] = mkButton(false, 0);
    console.log("keyUp", e.code, index, buttons[index]);
  }

  if (e.code in LEFT_STICK_KEYS) {
    pressedKeys.delete(e.code);
    keyPressTime.delete(e.code);
  }
}, true);