const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  description: {
    type: String
  }
});

const ProjectModel = mongoose.model('projects', ProjectSchema);

module.exports = ProjectModel;