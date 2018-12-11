"use strict";

const config = require("../config/config");
const mongoose = require('mongoose');

module.exports = function() {
  let db;

  mongoose.Promise = global.Promise;
  if (mongoose.connection.readyState !== 1) {
    console.log("Connecting to Mongo " + config.dbURL + " ...");
    const url = config.dbURL;
    console.log(url);
    db = mongoose.connect(url, config.dbOptions, (err) => {
      if(err){
        console.log(err);
        return err;
      }
    });
    mongoose.connection
      .once('open', () => {
        console.log(`Mongoose - successful connection ...`);
      })
      .on('error', error => console.warn(error));
  } else {
    console.log("Mongo already connected.");
    db = mongoose;
  }

  return mongoose.connection;
};