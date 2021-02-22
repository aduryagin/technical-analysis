(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./atr", "./averageGain", "./averageLoss", "./bollingerBands", "./ema", "./pmax", "./rma", "./rsi", "./sma", "./stdev", "./stochastic", "./trueRange", "./vwap", "./t3", "./pmaxRSI", "./vwma", "./fbb", "./wwma", "./var", "./ott", "./highest", "./lowest", "./williamsVix"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WilliamsVix = exports.lowest = exports.highest = exports.OTT = exports.VAR = exports.WWMA = exports.FBB = exports.VWMA = exports.PMaxRSI = exports.T3 = exports.VWAP = exports.trueRange = exports.stochastic = exports.STDEV = exports.SMA = exports.RSI = exports.RMA = exports.PMax = exports.EMA = exports.bollingerBands = exports.averageLoss = exports.averageGain = exports.ATR = void 0;
    var atr_1 = require("./atr");
    Object.defineProperty(exports, "ATR", { enumerable: true, get: function () { return atr_1.ATR; } });
    var averageGain_1 = require("./averageGain");
    Object.defineProperty(exports, "averageGain", { enumerable: true, get: function () { return averageGain_1.averageGain; } });
    var averageLoss_1 = require("./averageLoss");
    Object.defineProperty(exports, "averageLoss", { enumerable: true, get: function () { return averageLoss_1.averageLoss; } });
    var bollingerBands_1 = require("./bollingerBands");
    Object.defineProperty(exports, "bollingerBands", { enumerable: true, get: function () { return bollingerBands_1.bollingerBands; } });
    var ema_1 = require("./ema");
    Object.defineProperty(exports, "EMA", { enumerable: true, get: function () { return ema_1.EMA; } });
    var pmax_1 = require("./pmax");
    Object.defineProperty(exports, "PMax", { enumerable: true, get: function () { return pmax_1.PMax; } });
    var rma_1 = require("./rma");
    Object.defineProperty(exports, "RMA", { enumerable: true, get: function () { return rma_1.RMA; } });
    var rsi_1 = require("./rsi");
    Object.defineProperty(exports, "RSI", { enumerable: true, get: function () { return rsi_1.RSI; } });
    var sma_1 = require("./sma");
    Object.defineProperty(exports, "SMA", { enumerable: true, get: function () { return sma_1.SMA; } });
    var stdev_1 = require("./stdev");
    Object.defineProperty(exports, "STDEV", { enumerable: true, get: function () { return stdev_1.STDEV; } });
    var stochastic_1 = require("./stochastic");
    Object.defineProperty(exports, "stochastic", { enumerable: true, get: function () { return stochastic_1.stochastic; } });
    var trueRange_1 = require("./trueRange");
    Object.defineProperty(exports, "trueRange", { enumerable: true, get: function () { return trueRange_1.trueRange; } });
    var vwap_1 = require("./vwap");
    Object.defineProperty(exports, "VWAP", { enumerable: true, get: function () { return vwap_1.VWAP; } });
    var t3_1 = require("./t3");
    Object.defineProperty(exports, "T3", { enumerable: true, get: function () { return t3_1.T3; } });
    var pmaxRSI_1 = require("./pmaxRSI");
    Object.defineProperty(exports, "PMaxRSI", { enumerable: true, get: function () { return pmaxRSI_1.PMaxRSI; } });
    var vwma_1 = require("./vwma");
    Object.defineProperty(exports, "VWMA", { enumerable: true, get: function () { return vwma_1.VWMA; } });
    var fbb_1 = require("./fbb");
    Object.defineProperty(exports, "FBB", { enumerable: true, get: function () { return fbb_1.FBB; } });
    var wwma_1 = require("./wwma");
    Object.defineProperty(exports, "WWMA", { enumerable: true, get: function () { return wwma_1.WWMA; } });
    var var_1 = require("./var");
    Object.defineProperty(exports, "VAR", { enumerable: true, get: function () { return var_1.VAR; } });
    var ott_1 = require("./ott");
    Object.defineProperty(exports, "OTT", { enumerable: true, get: function () { return ott_1.OTT; } });
    var highest_1 = require("./highest");
    Object.defineProperty(exports, "highest", { enumerable: true, get: function () { return highest_1.highest; } });
    var lowest_1 = require("./lowest");
    Object.defineProperty(exports, "lowest", { enumerable: true, get: function () { return lowest_1.lowest; } });
    var williamsVix_1 = require("./williamsVix");
    Object.defineProperty(exports, "WilliamsVix", { enumerable: true, get: function () { return williamsVix_1.WilliamsVix; } });
});
