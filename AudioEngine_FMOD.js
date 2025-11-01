let studioSystem;
let testEventInstance;

const FMODModuleGlobal = window.FMODModule;

// Create FMOD instance
const FMOD = {};
FMOD.preRun = prerun;
FMOD.onRuntimeInitialized = runFMOD;

FMODModuleGlobal(FMOD);  // Initialize FMOD WASM



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


    // Get the event descriptions
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


export function play_sfx(event_name) {
     // Get the event descriptions
     const eventDesc = {};
     check(studioSystem.getEvent(`event:/${event_name}`, eventDesc));
 
 
     // Create an instance of the event
     const eventInst = {};
     check(eventDesc.val.createInstance(eventInst));
     testEventInstance = eventInst.val;
     testEventInstance.start();
     studioSystem.update();
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




// function to control filter Position :D
export function modulateFilter(val) {    
    if (studioSystem) {        
        studioSystem.setParameterByName("MasterFilter", val, false);
        // console.log(`FMOD: Filter Parameter to ${val}`)
        studioSystem.update();
    }
};

