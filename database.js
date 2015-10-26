var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name : String,
  challenges: {correct: Number, attempted: Number},
  words: {correct: Number, attempted: Number}
});

mongoose.model('users', User);
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/translate-users');
