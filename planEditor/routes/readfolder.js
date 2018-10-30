const Path = require('path');
const Fs = require('fs-extra');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const current = Path.resolve(req.query.f, req.query.s);
  console.log(current);
  const items = Fs.readdirSync(current).filter(path => {
    try {
      return Fs.lstatSync(Path.resolve(current, path)).isDirectory();
    } catch (e) {
      return false;
    }
  });
  res.send({
    success: true,
    current: current,
    message: `folder list is here`,
    items: [current, '..'].concat(items),
  })
});

module.exports = router;