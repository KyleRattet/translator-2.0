var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name : String,
  correctChallenges: Number,
  attemptedChallenges: Number,
  correctWords: Number,
  attemptedWords: Number,
});

mongoose.model('users', User);
mongoose.connect('mongodb://localhost/translate-users');
