const Path = require('path');
const app = require('../app');

exports.getImagePathByTemplate = function(template){
  if(template === 'First'){
    return Path.resolve('./templates');
  }
  return undefined;
};
exports.getFoldersById = function(id, config){
  return {
    source: Path.resolve(config.storageRoot, id, 'source'),
    final: Path.resolve(config.storageRoot, id, 'final'),
  };
};
