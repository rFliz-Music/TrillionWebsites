let studioSystem;
let testEventInstance;

FMOD = {};
FMOD.preRun = prerun;
FMOD.onRuntimeInitialized = runFMOD;

FMODModule(FMOD);  // Initialize FMOD WASM

function prerun() { 
    // Mount bank files into FMOD virtual FS
    const banks = ["Master.bank", "Master.strings.bank"];
    for (let name of banks) {
        FMOD.FS_createPreloadedFile("/", name, "fmod/banks/Desktop/" + name, true, false);
        console.log("Mounted:", name);
    }
}


function runFMOD() {
    // Create Studio System
    const out = {};
    check(FMOD.Studio_System_Create(out));
    studioSystem = out.val;

    // Initialize Studio System    
    check(studioSystem.initialize(1024, FMOD.STUDIO_INIT_NORMAL, FMOD.INIT_NORMAL, null));

    // Load the bank containing testEvent
    const bankHandle = {};
    check(studioSystem.loadBankFile("/Master.bank", FMOD.STUDIO_LOAD_BANK_NORMAL, bankHandle));
    check(studioSystem.loadBankFile("/Master.strings.bank", FMOD.STUDIO_LOAD_BANK_NORMAL, bankHandle));
    console.log("Bank loaded");


    // Get the event description
    const eventDesc = {};
    check(studioSystem.getEvent("event:/testEvent", eventDesc));

    // Create an instance of the event
    const eventInst = {};
    check(eventDesc.val.createInstance(eventInst));
    testEventInstance = eventInst.val;



    // ========================================================================

    console.log("Event instance ready");

    // Wire button click to play the event
    document.getElementById("start").addEventListener("click", () => {
        testEventInstance.start();
        studioSystem.update();
        console.log("Event started!");
    });


    // Slider controls the global pitch parameter
    document.getElementById("dial").addEventListener("input", e => {
        const val = parseFloat(e.target.value);
        if (studioSystem) {
          studioSystem.setParameterByName("Pitch", val, false);
          studioSystem.update();
        }
      });


    // UPDATE FUNCTION
    update()    
    setInterval(update, 2000); // Call every 2 seconds

}


// Minimal error checking
function check(result) {
    if (result !== FMOD.OK) {
        throw new Error("FMOD error: " + FMOD.ErrorString(result));
    }
}











// ============ GAME LOOP ============
function update() {// The "Plank Time of our Simulation"    
    minimalFmodTick()    
    // printLog()
}
// ===================================




// Minimal FMOD update loop called every 4 seconds
function minimalFmodTick() {
    if (studioSystem) {
        studioSystem.update();        
    }
}


// Prints the log onto the window display itself
function printLog() {
    const logOutput = document.getElementById("logOutput");
    const logBuffer = [];
    const MAX_LOGS = 10;
  
    ['log','warn','error'].forEach(type => {
      const original = console[type];
      console[type] = function(...args) {
        original.apply(console, args);
  
        const msg = args.join(' ');
        logBuffer.push(msg);
  
        if (logBuffer.length > MAX_LOGS) logBuffer.shift();
  
        logOutput.textContent = logBuffer.join('\n');        
      }
    });
}




