
    const originalGetGamepads = navigator.getGamepads.bind(navigator);
    const VIRTUAL_INDEX = 0;


    const buttons = Array.from({ length: 17 }, () => mkButton(false, 0));


    const keyToConsoleMapping = {
        KeyI: 0, //A, B,X, Y
        KeyJ: 1,
        KeyK: 2,
        KeyL: 3,

        KeyW: 12,
        KeyA: 13, 
        KeyS: 14, 
        KeyD: 15,

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



  navigator.getGamepads = function () {
    const pads = originalGetGamepads() || [];
    const copy = Array.from(pads);
    copy[VIRTUAL_INDEX] = makeGamepad();
    return copy;
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

        let index = Number(keyToConsoleMapping[e.code])
        buttons[index] = mkButton(true, 1)
        console.log("keyDown", buttons[index])
    }, true);

    window.addEventListener("keyup", (e) => {

        let index = Number(keyToConsoleMapping[e.code])
        buttons[index] = mkButton(false, 0)
        console.log("keyUp", buttons[index])
    }, true);




