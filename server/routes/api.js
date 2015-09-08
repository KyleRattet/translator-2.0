var express = require('express');
var router = express.Router();
var keys = require('../../keys.js');
var bt = require('bing-translate').init({
    client_id: keys.id,
    client_secret: keys.secret
  });
var languages = require('../languages/languages.js');
var randomWord = require('random-word');
var mongoose = require('mongoose');
var User = mongoose.model('users');

// translate a string
router.post('/translate', function(req, res, next) {
  console.log(req.body);
  bt.translate(req.body.text, languages[req.body.from], languages[req.body.to], function(err, translated){
    if (err) {
      res.json(err);
    } else {
      res.json(translated);
    }
  });
});

// generate and send back random words for test
router.post('/test', function(req, res, next){
  var wordArray = getWord();
  var translatedArray = [];
  for (var i = 0; i < wordArray.length; i++) {
    var word = translateWords(wordArray[i], languages[req.body.from], function(err, data){
      translatedArray.push(data);
      if(translatedArray.length === 19){
        res.send({array: translatedArray, fromLanguage:req.body.from, toLanguage: req.body.to});
      }
    });
  }
});

// update user data
router.put('/user/:id', function(req, res, next) {
  console.log(req.body);
  var query = {'_id': req.params.id};
  var update = {
    challenges: {correct: req.body['challenges[correct]'],
                 attempted: req.body['challenges[attempted]']},
    words: {correct: req.body['words[correct]'],
            attempted: req.body['words[attempted]']}
  };
  var options = {new: true};

  User.findOneAndUpdate(query, update, options, function(err, user) {
    res.json({
      message: "User data updated.",
      user: user
    });
  });
});

// helpers

function translateWords(word, fromLanguage, callback){
    bt.translate(word, 'en', fromLanguage, function(err, translated){
      if(err){
        console.log('err');
      } else {
        return callback(null, translated.translated_text);
      }
    });
  }

function getWord(){
  var wordArray = [];
   for (var i = 0; i < 20; i++) {
     var word = randomWord();
     wordArray.push(word);
   }
   return wordArray;
}

module.exports = router;
