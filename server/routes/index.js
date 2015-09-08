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

router.get('/users/login/:name', function(req, res, next){
  console.log(req.params);
  var query = {'name': req.params.name};
  User.findOne(query, function(err, User){
    res.send(User);
  });
});

router.post('/users/new', function (req, res, next){
  console.log(req.body);
  var newUser = new User({
    name: req.body.userName,
    challenges: {correct: 0, attempted: 0},
    words: {correct: 0, attempted: 0}
  });
  newUser.save(function(err) {
    console.log('New user saved to db.');
  })
  res.send(newUser);
});

module.exports = router;
