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

    const bufferSize = 2048;

    // Create Studio System
    const out = {};
    check(FMOD.Studio_System_Create(out));
    studioSystem = out.val;

    // Initialize Studio System    
    check(studioSystem.initialize(bufferSize, FMOD.STUDIO_INIT_NORMAL, FMOD.INIT_NORMAL, null));

    // Load the bank containing testEvent
    const bankHandle = {};
    check(studioSystem.loadBankFile("/Master.bank", FMOD.STUDIO_LOAD_BANK_NORMAL, bankHandle));
    check(studioSystem.loadBankFile("/Master.strings.bank", FMOD.STUDIO_LOAD_BANK_NORMAL, bankHandle));
    console.log("Bank loaded");


    // Get the event description
    const eventDesc = {};
    check(studioSystem.getEvent("event:/MainMusic_play", eventDesc));

    // Create an instance of the event
    const eventInst = {};
    check(eventDesc.val.createInstance(eventInst));
    testEventInstance = eventInst.val;



    // ========================================================================

    console.log("Event instance ready");
    testEventInstance.start();
    studioSystem.update();


    // UPDATE FUNCTION
    update()
    setInterval(update, 100); // Call every 100 miliseconds

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




