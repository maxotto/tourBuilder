const KrPanoFile = require('./krPanoFile');

const tour = new KrPanoFile('../outFolder/tour.xml');
let tourXml;
tour.load()
    .then(xml=>{
        console.log(xml)
    })
    .catch(e =>{
        console.log(e)
    });