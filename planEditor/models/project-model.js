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

});

ProjectSchema.pre('validate', function (next) {
  if (this.folder === this.outFolder) {
    this.invalidate('Folder', 'In and Out folders must be different');
  }
  next();
});

const ProjectModel = mongoose.model('projects', ProjectSchema);

module.exports = ProjectModel;