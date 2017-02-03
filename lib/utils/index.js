module.exports = {
    stripName: stripName
}

function stripName(name){
    return name.replace('appc.sqlite3/', '');
}