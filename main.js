const argv = require("yargs").argv;
const repl = require("repl");
var Messaging = require("catch-messaging");
var pjson = require("./package.json");

/* Service Parameters*/
var serviceName = argv.serviceName || "Angle Parser";
var debug = argv.debug;
var debounceTime = argv.debounceTime || "debounceTime";
var publishChangesOnly = argv.publishChangesOnly || false;
var region1MinEl = argv.region1MinEl;
var region1MaxEl = argv.region1MaxEl;
var region1MinAz = argv.region1MinAz;
var region1MaxAz = argv.region1MaxAz;
var region2MinEl = argv.region2MinEl;
var region2MaxEl = argv.region2MaxEl;
var region2MinAz = argv.region2MinAz;
var region2MaxAz = argv.region2MaxAz;
var region3MinEl = argv.region3MinEl;
var region3MaxEl = argv.region3MaxEl;
var region3MinAz = argv.region3MinAz;
var region3MaxAz = argv.region3MaxAz;
var region4MinEl = argv.region4MinEl;
var region4MaxEl = argv.region4MaxEl;
var region4MinAz = argv.region4MinAz;
var region4MaxAz = argv.region4MaxAz;
var region5MinEl = argv.region5MinEl;
var region5MaxEl = argv.region5MaxEl;
var region5MinAz = argv.region5MinAz;
var region5MaxAz = argv.region5MaxAz;

var messaging;
var regions = [];
var currentRegion;
var debounceActive = false;
var elevation;
var azimuth;
var enabled = true;

// Sample commands for testing.
var serviceCommands = pjson.commands || [];

// Sample responses for testing.
var serviceResponses = pjson.responses || [];

/**
 * Prints the Service Name and a message to the console.
 * @param {string} message - The message to print.
 */
function log(message) {
  if (debug) {
    console.log(serviceName + ": " + message);
  }
}

/* Initialize commands and responses */

try {
  if (argv.serviceCommands) {
    serviceCommands = JSON.parse(argv.serviceCommands);
  }
} catch (e) {
  log("Exception parsing serviceCommands: " + e);
}

try {
  if (argv.serviceResponses) {
    serviceResponses = JSON.parse(argv.serviceResponses);
  }
} catch (e) {
  log("Exception parsing serviceResponses: " + e);
}

messaging = new Messaging(
  serviceName,
  serviceCommands,
  serviceResponses,
  debug,
  (message) => {
    processCommand(message);
  }
);

/* Command Line Interface */

repl.start({ prompt: "> ", eval: evaulateCliCommands });
function evaulateCliCommands(command, context, filename, callback) {
  processCommand(command);
  callback(null, "OK");
}

/* Parse Service Commands */

function processCommand(command) {
  log("Processing command: " + command);
  if (!command.includes(":")) {
    switch (command) {
      case "getCurrentRegion":
        getCurrentRegion();
        break;
      case "getEnabledStatus":
        getEnabledStatus();
        break;
      case "enable":
        enabled = true;
        getEnabledStatus();
        break;
      case "disable":
        enabled = false;
        getEnabledStatus();
        break;
    }
    return;
  }
  const commandArray = command.split(":");
  if (commandArray.length === 2) {
    switch (commandArray[0]) {
      case "updateElevation":
        updateElevation(commandArray[1]);
        break;
      case "updateAzimuth":
        updateAzimuth(commandArray[1]);
        break;
      default:
        break;
    }
  }
}

/* Parent Process */

process.on("message", (data) => {
  if (data === "catch-service-close") {
    log("Exiting on catch-service-close message received from parent process.");
    exit();
  }
});

/* Exit cleanly */

function exit() {
  log("Exiting");
  messaging.publish(serviceName + ".disconnected", null);
  setTimeout(() => messaging.exit(), 100);
}

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    log("exitHandler cleanup");
    exit();
  }
  if (exitCode || exitCode === 0) {
    log("exitHandler exitCode: " + exitCode);
  }
  if (options.exit) {
    process.exit();
  }
}

// Do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

// Catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// Catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

// Catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

/* Angle Parsing */
initializeRegions();
function initializeRegions() {
  //inititalize region1
  var region1 = [];
  if (region1MinEl === null) {
    return;
  }
  region1.push(region1MinEl);
  if (region1MaxEl === null) {
    return;
  }
  region1.push(region1MaxEl);
  if (region1MinAz === null) {
    return;
  }
  region1.push(region1MinAz);
  if (region1MaxAz === null) {
    return;
  }
  region1.push(region1MaxAz);
  regions.push(region1);

  //inititalize region2
  var region2 = [];
  if (region2MinEl === null) {
    return;
  }
  region2.push(region2MinEl);
  if (region2MaxEl === null) {
    return;
  }
  region2.push(region2MaxEl);
  if (region2MinAz === null) {
    return;
  }
  region2.push(region2MinAz);
  if (region2MaxAz === null) {
    return;
  }
  region2.push(region2MaxAz);
  regions.push(region2);

  //inititalize region3
  var region3 = [];
  if (region3MinEl === null) {
    return;
  }
  region3.push(region3MinEl);
  if (region3MaxEl === null) {
    return;
  }
  region3.push(region3MaxEl);
  if (region3MinAz === null) {
    return;
  }
  region3.push(region3MinAz);
  if (region3MaxAz === null) {
    return;
  }
  region3.push(region3MaxAz);
  regions.push(region3);

  //inititalize region4
  var region4 = [];
  if (region4MinEl === null) {
    return;
  }
  region4.push(region4MinEl);
  if (region4MaxEl === null) {
    return;
  }
  region4.push(region4MaxEl);
  if (region4MinAz === null) {
    return;
  }
  region4.push(region4MinAz);
  if (region4MaxAz === null) {
    return;
  }
  region4.push(region4MaxAz);
  regions.push(region4);

  //inititalize region5
  var region5 = [];
  if (region5MinEl === null) {
    return;
  }
  region5.push(region5MinEl);
  if (region5MaxEl === null) {
    return;
  }
  region5.push(region5MaxEl);
  if (region5MinAz === null) {
    return;
  }
  region5.push(region5MinAz);
  if (region5MaxAz === null) {
    return;
  }
  region5.push(region5MaxAz);
  regions.push(region5);
}

function getCurrentRegion() {
  if (currentRegion === null) {
    messaging.publish("region:null");
  }
  messaging.publish("region:" + currentRegion);
}

function getEnabledStatus() {
  messaging.publish("enabled:" + enabled);
}

function updateElevation(el) {
  if (el != null && enabled) {
    elevation = el;
    calculateRegion(elevation, azimuth);
  }
}

function updateAzimuth(az) {
  if (az != null && enabled) {
    azimuth = az;
    calculateRegion(elevation, azimuth);
  }
}

function calculateRegion(elevation, azimuth) {
  if (debounceActive) {
    return;
  }

  startDebounce();

  log(
    "Calculating region for elevation: " +
      elevation +
      " and azimuth: " +
      azimuth
  );

  for (var i = regions.length - 1; i > -1; i--) {
    var region = regions[i];
    if (
      elevation >= region[0] &&
      elevation <= region[1] &&
      azimuth >= region[2] &&
      azimuth <= region[3]
    ) {
      if (publishChangesOnly && currentRegion === i + 1) {
        log("Region unchanged.");
        break;
      }
      currentRegion = i + 1;
      getCurrentRegion();
      log("Calculated region: " + currentRegion);
      break;
    }
  }
}

function startDebounce() {
  debounceActive = true;
  debounceTimeout = setTimeout(() => {
    debounceActive = false;
  }, debounceTime);
}
