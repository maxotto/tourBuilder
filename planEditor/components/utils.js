const Path = require('path');

exports.getImagePathByTemplate = function(template){
  if(template === 'First'){
    return Path.resolve('./templates');
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
