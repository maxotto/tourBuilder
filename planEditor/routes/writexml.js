var express = require('express');
var router = express.Router();
var XmlWriter = require('../components/xmlSaver');

/* write data from XML. */
router.post('/:id', function(req, res, next) {
  const id = req.params.id;
  var config = req.app.get('config');
  console.log(req.query.type);
  const writer = new XmlWriter(config, id, req.body, req.query.type);
  writer.write()
    .then((result) => {
      console.log(result);
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