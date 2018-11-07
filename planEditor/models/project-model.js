const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  folder: {
    type: String,
    required: true,
  },
  outFolder: {
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
  }

});

ProjectSchema.index({template: 1, outFolder: 1}, {unique: true});

ProjectSchema.pre('validate', function (next) {
  if (this.folder === this.outFolder) {
    this.invalidate('Folder', 'In and Out folders must be different');
  }
  next();
});



const ProjectModel = mongoose.model('projects', ProjectSchema);

module.exports = ProjectModel;