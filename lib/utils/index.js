module.exports = {
    stripName: stripName,
    getRootModelName: getRootModelName
};

function stripName(name){
    return name.replace('appc.sqlite3/', '');
}

function getRootModelName(model){
    var parent = model;
    while (parent._parent && parent._parent.name) {
      parent = parent._parent;
    }
    return parent.name;
}