const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonLib = require('../common/common-lib');

const ProjectSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  state: {
    floors: {
      type: Boolean,
      required: true,
    },
    floorsImages: {
      type: Boolean,
      required: true,
    },
    hotspots: {
      type: Boolean,
      required: true,
    },
    lookatTag: {
      type: Boolean,
      required: true,
    },
    needRebuild: {
      type: Boolean,
      required: true,
    },
    built: {
      type: Boolean,
      required: true,
    },
    lookatValue: {
      type: Boolean,
      required: true,
    },
    planHotspots: {
      type: Boolean,
      required: true,
    },
  },
  floorSelect:{
    type: Array
  },
  tour: {
    type: String
  },

});

ProjectSchema.pre('save', function(next) {
  this.state = commonLib.calcState(this);
  this.markModified('state.floors');
  next();
});

const ProjectModel = mongoose.model('projects', ProjectSchema);

module.exports = ProjectModel;