const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema(
  {
    description: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date
    },
    completed: {
      type: Boolean
    },
    filePath: {
      type: String
    },
    fileType: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Todo', Todo);
