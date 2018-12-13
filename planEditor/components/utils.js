const Path = require('path');
// var appRoot = require('app-root-path');

exports.getImagePathByTemplate = function(template){
  if(template === 'First'){
    return require('app-root-path').resolve('../templates');
  }
  return undefined;
};
exports.getFoldersById = function(id, config){
  return {
    root: Path.resolve(config.storageRoot, id),
    source: Path.resolve(config.storageRoot, id, 'source'),
    final: Path.resolve(config.storageRoot, id, 'final'),
  };
};
