window.utils = {};
window.utils.deepSet = function (obj, value, path) {
    var i;
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    obj[path[i]] = value;
}

window.utils.deepGet = function (obj, path) {
    var i;
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    return obj[path[i]];
}

window.utils.toMmSs = function (value) {
    if (value == null || value == undefined) return "--:--:--";
    return new Date(value * 1000).toISOString().substr(11, 8).replace(/^(\d{2}):(\d{2}):(\d{2})$/g, "$1時$2分$3秒").replaceAll(/00./g, '');
}