var express = require('express');
var router = express.Router();
var http = require('http');
var keys = require('../../keys.js');
var bt = require('bing-translate').init({
    client_id: keys.id,
    client_secret: keys.secret
  });
var languages = require('../languages/languages.js');
var randomWord = require('random-word');
var mongoose = require('mongoose');
var User = mongoose.model('users');

router.get('/', function(req, res, next) {
  res.render('index', {
    object: languages
    });
});

// for testing charting functions of User
router.get('/progress', function(req, res) {
  res.render('progress', {username: "George"});
});

router.post('/users/login', function(req, res, next){
  var query = {'name': req.params.userName};
  User.findOne(query, function(err, User){
    console.log(User);
    res.send(User);
  });
});

router.post('/users/new', function (req, res, next){
  new User({
    name: req.body.name,
    correctChallenges: req.body.correctChallenges,
    attemptedChallenges: req.body.correctChallenges,
    correctWords: req.body.correctWords,
    attemptedWords: req.body.attemptedWords,
  });
  res.send(User);
});

module.exports = router;
