var express = require('express');
var router = express.Router();
var XmlWriter = require('../components/xmlSaver');

/* write data from XML. */
router.post('/', function(req, res, next) {
  var config = req.app.get('config');
  const writer = new XmlWriter(config, req.body);
  writer.write()
    .then((result) => {
      res.send(JSON.stringify(
        {
          status:'ok'
        }
        )
      );
    }
    )
    .catch((err)=>{
      console.log({err});
      res.send(JSON.stringify({
        status:'error',
        message: err
      }));
  });


});

module.exports = router;