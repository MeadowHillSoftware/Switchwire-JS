"use strict";

var oSwitchwire = {};

oSwitchwire.oSchedule = {
    iDelay: 10,
    oSunday: {
        aProcesses: [
            "pcmanfm-qt",
            "geany",
            "mousepad"
        ],
        oPhases: {}
    },
    oMonday: {
        aProcesses: [
            "pcmanfm-qt",
            "geany",
            "mousepad"
        ],
        oPhases: {
            700: {
                iLast: 759,
                aExceptions: [
                    "mousepad"
                ]
            },
            800: {
                iLast: 1159,
                aExceptions: []
            },
            1200: {
                iLast: 1259,
                aExceptions: [
                    "geany",
                    "mousepad"
                ]
            },
            1300: {
                iLast: 1659,
                aExceptions: []
            },
            2300: {
                iLast: 2359,
                aExceptions: []
            }
        }
    },
    oTuesday: {
        aProcesses: [
            "pcmanfm-qt",
            "geany",
            "mousepad"
        ],
        oPhases: {
            700: {
                iLast: 759,
                aExceptions: [
                    "mousepad"
                ]
            },
            800: {
                iLast: 1159,
                aExceptions: []
            },
            1200: {
                iLast: 1259,
                aExceptions: [
                    "geany",
                    "mousepad"
                ]
            },
            1300: {
                iLast: 1659,
                aExceptions: []
            },
            2300: {
                iLast: 2359,
                aExceptions: []
            }
        }
    },
    oWednesday: {
        aProcesses: [
            "pcmanfm-qt",
            "geany",
            "mousepad"
        ],
        oPhases: {
            700: {
                iLast: 759,
                aExceptions: [
                    "mousepad"
                ]
            },
            800: {
                iLast: 1159,
                aExceptions: []
            },
            1200: {
                iLast: 1259,
                aExceptions: [
                    "geany",
                    "mousepad"
                ]
            },
            1300: {
                iLast: 1659,
                aExceptions: []
            },
            2300: {
                iLast: 2359,
                aExceptions: []
            }
        }
    },
    oThursday: {
        aProcesses: [
            "pcmanfm-qt",
            "mousepad"
        ],
        oCaps: {
            "mousepad": 2
        }
        oPhases: {
            700: {
                iLast: 759,
                aExceptions: [
                    "mousepad"
                ]
            },
            800: {
                iLast: 1159,
                aExceptions: []
            },
            1200: {
                iLast: 1259,
                aExceptions: [
                    "geany",
                    "mousepad"
                ]
            },
            1300: {
                iLast: 1659,
                aExceptions: []
            },
            2300: {
                iLast: 2359,
                aExceptions: []
            }
        }
    },
    oFriday: {
        aProcesses: [
            "pcmanfm-qt",
            "geany",
            "mousepad"
        ],
        oPhases: {
            700: {
                iLast: 759,
                aExceptions: [
                    "mousepad"
                ]
            },
            800: {
                iLast: 1159,
                aExceptions: []
            },
            1200: {
                iLast: 1259,
                aExceptions: [
                    "geany",
                    "mousepad"
                ]
            },
            1300: {
                iLast: 1659,
                aExceptions: []
            },
            2300: {
                iLast: 2359,
                aExceptions: []
            }
        }
    },
    oSaturday: {
        aProcesses: [
            "pcmanfm-qt",
            "geany",
            "mousepad"
        ],
        oPhases: {}
    }
};

oSwitchwire.detectMultipleProcesses = function() {
    var aDisallowed = oSwitchwire.aDisallowed;
    for (var i = 0; i < aDisallowed.length; i++) {
        var sProcess = aDisallowed[i];
        var sCommand = "pidof " + sProcess;
        oSwitchwire.exec(sCommand, oSwitchwire.getProcessName);
    }
    for (var p = 0; p < aCapped.length; p++) {
        var sProcess = aCapped[p];
        var sCommand = "pidof " + sProcess;
        oSwitchwire.exec(sCommand, oSwitchwire.getMeteredProcess);
    }
};

oSwitchwire.exec = require('child_process').exec;

oSwitchwire.getCurrentPhase = function() {
    var oDate = new Date();
    var iCurrentDay = oDate.getDay();
    var iSetDay = oSwitchwire.iDay;
    oSwitchwire.iIterations = 0;
    if (iCurrentDay === iSetDay) {
        var iTime = oSwitchwire.getTime();
        var oPhases = oSwitchwire.oPhases;
        var aFirsts = Object.keys(oPhases);
        var bInPhase = false;
        for (var i = 0; i < aFirsts.length; i++) {
            var sFirst = aFirsts[i]
            var iFirst = Number(sFirst);
            if (iTime >= iFirst) {
                var oPhase = oPhases[sFirst];
                var iLast = oPhase.iLast;
                if (iTime <= iLast) {
                    oSwitchwire.oCurrentPhase = oPhase;
                    bInPhase = true;
                    oSwitchwire.getDisallowed();
                }
            }
        }
        if (bInPhase = false) {
            oSwitchwire.oCurrentPhase = {};
            oSwitchwire.aDisallowed = [];
        }
        oSwitchwire.bInPhase = bInPhase;
    } else {
        oSwitchwire.setDay();
        oSwitchwire.parseSchedule();
        oSwitchwire.getCurrentPhase();
    }
};

oSwitchwire.getDisallowed = function() {
    var oPhase = oSwitchwire.oCurrentPhase;
    var aProcesses = oSwitchwire.aProcesses;
    var aExceptions = oPhase.aExceptions;
    var aDisallowed = [];
    for (var p = 0; p < aProcesses.length; p++) {
        var sProcess = aProcesses[p];
        if (aExceptions.indexOf(sProcess) === -1); {
            aDisallowed.push(sProcess);
        }
    }
    oSwitchwire.aDisallowed = aDisallowed;
};

oSwitchwire.getMeteredProcess = function(error, stdout, stderr) {
    var sId = stdout;
    if (sId !== "") {
        var sCommand = "ps -fp " + sId;
        oSwitchwire.exec(sCommand, oSwitchwire.incrementMeter);
    }
};

oSwitchwire.getProcessName = function(error, stdout, stderr) {
    var sId = stdout;
    if (sId !== "") {
        var sCommand = "ps -fp " + sId;
        oSwitchwire.exec(sCommand, oSwitchwire.killProcess);
    }
};

oSwitchwire.getTime = function() {
    var oDate = new Date();
    var iHour = oDate.getHours();
    var iMinute = oDate.getMinutes();
    var sMinute = String(iMinute);
    if (iMinute < 10) {
        var sMinute = "0" + sMinute;
    }
    var sHour = String(iHour);
    var sTime = "";
    if (iHour > 0) {
        sTime = sHour + sMinute;
    } else {
        sTime = sMinute;
    }
    var iTime = Number(sTime);
    return iTime;
};

oSwitchwire.incrementMeter = function(error, stdout, stderr) {
    var sOutput = stdout;
    var aOutput = sOutput.split("/");
    var iIndex = (aOutput.length - 1)
    var sSubstring = aOutput[iIndex]
    var sProcess = sSubstring.slice(0, -1);
    oSwitchwire.oMeter[sProcess] += oSwitchwire.iDelay;
    var iMeter = oSwitchwire.oMeter[sProcess];
    var iCap = oSwitchwire.oCaps[sProcess];
    if (iMeter >= iCap) {
        var sCommand = "killall " + sProcess;
        oSwitchwire.exec(sCommand);
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

oSwitchwire.loopAction = function() {
    var iIterations = oSwitchwire.iIterations;
    var iMaxIterations = oSwitchwire.iMaxIterations;
    if (iIterations === iMaxIterations) {
        oSwitchwire.getCurrentPhase;
    } else {
        oSwitchwire.iIterations++;
    }
    oSwitchwire.detectMultipleProcesses();        
};

oSwitchwire.oCurrentPhase = {};

oSwitchwire.parseSchedule = function() {
    var oSchedule = oSwitchwire.oSchedule;
    var iDelay = oSchedule.iDelay;
    oSwitchwire.iDelay = iDelay;
    var iIterations = 60 / iDelay;
    oSwitchwire.iMaxIterations = iIterations;
    var iDay = oSwitchwire.iDay;
    var sDay = String(iDay);
    var oDayObjectMap = {
        "0": oSchedule.oSunday,
        "1": oSchedule.oMonday,
        "2": oSchedule.oTuesday,
        "3": oSchedule.oWednesday,
        "4": oSchedule.oThursday,
        "5": oSchedule.oFriday,
        "6": oSchedule.oSaturday
    };
    var oToday = oDayObjectMap[sDay];
    oSwitchwire.aProcesses = oToday.aProcesses;
    var oCaps = oToday.oCaps;
    oSwitchwire.oCaps = oCaps;
    var aCapped = Object.keys(oToday.oCaps);
    oSwitchwire.aCapped = aCapped;
    oSwitchwire.oMeter = {};
    for (var i = 0; i < aCapped.length; i++) {
        var sProcess = aCapped[i];
        oSwitchwire.oMeter[sProcess] = 0;
        var iMinutes = oCaps[sProcess];
        var iSeconds = iMinutes * 60;
        oSwitchwire.oCaps[sProcess] = iSeconds;
    }
    oSwitchwire.oPhases = oToday.oPhases;
};

oSwitchwire.setDay = function() {
    var oDate = new Date();
    oSwitchwire.iDay = oDate.getDay();
};

oSwitchwire.setDay();
oSwitchwire.parseSchedule();
oSwitchwire.getCurrentPhase();
oSwitchwire.loopAction();
setInterval(oSwitchwire.loopAction, (oSwitchwire.iDelay * 1000));
