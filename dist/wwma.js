(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WWMA = void 0;
    function WWMA({ source, period }) {
        let result = [];
        const wwalpha = 1 / period;
        function calculate(src) {
            var _a;
            return {
                value: wwalpha * src.value +
                    (1 - wwalpha) * (((_a = result[result.length - 1]) === null || _a === void 0 ? void 0 : _a.value) || 0),
                time: src.time,
            };
        }
        source.forEach((item) => {
            const res = calculate(item);
            if (res)
                result.push(res);
        });
        return {
            update: (src) => {
                if (result.length && result[result.length - 1].time === src.time) {
                    result = result.slice(0, -1);
                }
                const item = calculate(src);
                if (item)
                    result.push(item);
                return item;
            },
            result: () => result,
        };
    }
    exports.WWMA = WWMA;
});
