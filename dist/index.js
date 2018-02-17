"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireConfigVars = (config) => {
    const missingEnvVars = [];
    Object.keys(config).forEach(key => {
        if (!process.env[key])
            missingEnvVars.push(key);
    });
    return missingEnvVars;
};
exports.baseRequire = (...config) => { };
exports.default = exports.requireConfigVars;
//# sourceMappingURL=index.js.map