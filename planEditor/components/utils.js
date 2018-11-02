const Path = require('path');

exports.getImagePathByTemplate = function(template){
  if(template === 'First'){
    return Path.resolve('./templates');
  }
  return undefined;
};
