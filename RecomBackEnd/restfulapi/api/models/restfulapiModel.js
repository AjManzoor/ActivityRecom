'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UsersSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required : true
  }
});

module.exports = mongoose.model('Users', UsersSchema);