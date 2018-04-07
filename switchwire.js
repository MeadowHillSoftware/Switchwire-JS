"use strict";

var oSwitchwire = {};

oSwitchwire.exec = require('child_process').exec;

oSwitchwire.detectProcess = function(error, stdout, stderr) {
    var sId = stdout
    if (typeof sId === "string") {
        console.log(sId);
        oSwitchwire.exec("killall geany", oSwitchwire.callback);
    }
};

oSwitchwire.sCommand = "pidof geany";

oSwitchwire.exec(oSwitchwire.sCommand, oSwitchwire.detectProcess);
