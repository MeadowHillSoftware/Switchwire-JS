"use strict";

var oSwitchwire = {};

oSwitchwire.aHitList = ["geany", "clementine", "mousepad"];

oSwitchwire.exec = require('child_process').exec;

oSwitchwire.getProcessName = function(error, stdout, stderr) {
    var sId = stdout;
    if (sId !== "") {
        var sCommand = "ps -fp " + sId;
        oSwitchwire.exec(sCommand, oSwitchwire.killProcess);
    }
};

oSwitchwire.detectMultipleProcesses = function() {
    var aHitList = oSwitchwire.aHitList;
    for (var i = 0; i < aHitList.length; i++) {
        var sProcess = aHitList[i];
        var sCommand = "pidof " + sProcess;
        oSwitchwire.exec(sCommand, oSwitchwire.getProcessName);
    }
};

oSwitchwire.killProcess = function(error, stdout, stderr) {
    var sOutput = stdout;
    var aOutput = sOutput.split("/");
    var iIndex = (aOutput.length - 1)
    var sSubstring = aOutput[iIndex]
    var sProcess = sSubstring.slice(0, -1);
    var sCommand = "killall " + sProcess;
    oSwitchwire.exec(sCommand);
};

oSwitchwire.detectMultipleProcesses();
