var express = require('express');
var router = express.Router();
var http = require('http');
var keys = require('../../keys.js');
var bt = require('bing-translate').init({
    client_id: keys.id,
    client_secret: keys.secret
  });
var languages = require('../languages/languages.js');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Practice Translating',
    object: languages
    });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  bt.translate(req.body.text, languages[req.body.from], languages[req.body.to], function(err, translated){
  if (err) {
    res.json(err);
  } else {
    res.json(translated);
  }
  });
});


router.post('/test', function(req, res, next){
  console.log(req.body);
  var wordArray = [];
  for (var i = 0; i < 20; i++) {
    getWord(function(err, data){
      if (err){
        console.log('error');
      } else {
        wordArray.push(data);
        if (wordArray.length === 19){
          var cleanArray = regexStrings(wordArray);
          var response = translateWords(wordArray, languages[req.body.from], function(err, data){
            res.send(response);
          });
        }
      }
    });
  }
});

function translateWords(array, fromLanguage, callback){
  var translatedArray = [];
  for (var i = 0; i < 20; i++) {
    bt.translate(array[i], 'en', fromLanguage, function(err, translated){
      // console.log(translated);
      translatedArray.push(translated.response);
      // console.log(translatedArray);
      // if (translatedArray === 19){
      //   console.log(translatedArray;
      // }
    });
  }
}

function regexStrings(array){
  var cleanArray = [];
  for (var i = 0; i < array.length; i++) {
    var newWord = array[i].replace(value = value.replace(/(?:\\[rn])+/g, ""));
    cleanArray.push(newWord);
  }
  return cleanArray;
}


function getWord(callback){
  http.get("http://randomword.setgetgo.com/get.php", function(response){
      response.setEncoding('utf8');
      response.on('data', function(data){
        return callback(null, data);
      });
    });
}

module.exports = router;
