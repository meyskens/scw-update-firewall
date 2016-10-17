require("babel-polyfill");
require("babel-register");

var fs = require("fs");
try {
    global.config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
} catch (error) {
    console.error("Failed to load the config file. Are you sure you have a valid config.json?");
    console.error("The error was:", error.message);
    process.exit(1);
}

require("./firewall.js");
