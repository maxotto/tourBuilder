const LocalSettings = require('./localSettings');
// do not use VAR or CONST to make config global, visible inside planEditor Web server
config = {
  outFolder: LocalSettings.outFolder,
};
console.log('Run');
var exec = require('child_process').exec;
exec('buildPlanEditorClient.cmd', function callback(error, stdout, stderr){
  if(error) {
    console.log(error);
  } else if(stderr) {
    console.log(stderr);
  } else {
    console.log(stdout);
    const Server = require('./planEditor/bin/www');
    console.log('Server is running. Open http://localhost:3000 to justify hotstops on floors` maps.');
    console.log('Type Ctrl-C to terminate WEB server.');
    console.log("\007");
  }
});