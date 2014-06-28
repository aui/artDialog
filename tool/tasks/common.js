function require (id) {
    var mod = require._modules[id];
    var exports = mod.exports = {};

    if (typeof mod === 'object') {
        return mod;
    }

    return mod.call(
        exports,
        require,
        exports,
        mod
    ) || exports;
}

require._modules = {};

function define (path, fn) {
    require._modules[path] = fn;
}
