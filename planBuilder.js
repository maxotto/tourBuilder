const LocalSettings = require('./localSettings');
// do not use VAR or CONST to make config global, visible inside planEditor Web server
config = {
  outFolder: LocalSettings.outFolder,
};
const Server = require('./planEditor/bin/www');
console.log('Server is running. Open http://localhost:3000 to justify hotstops on floors` maps.');
console.log('Type Ctrl-C to terminate WEB server.');
console.log("\007");
