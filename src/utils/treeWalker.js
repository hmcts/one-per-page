
function walkMap(map, callback, path = '', target = {}){
    for (var key in map) {
        target[key] = interpret(map[key], callback, target, path + key);
    }
    return target;
}

function interpret(value, callback, target, path){
    if (Array.isArray(value)){
        return walkArray(value, callback, path);
    } else if (typeof value === 'object'){
        return walkMap(value, callback, path + '.');
    } else {
        return callback(path, value);
    }
}

function walkArray(array, callback, path, target = []){
    for (var index in array) {
        target.push(interpret(array[index], callback, target, path + '[' + index + ']'));
    }
    return target;
}

module.exports = walkMap;