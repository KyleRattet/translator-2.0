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
  var wordArray = [];
  for (var i = 0; i < 20; i++) {
      var word = getWord(function(data){
        wordArray.push(data);
          if(wordArray.length === 19){
             res.send(wordArray);
          }
      });
    }
});


function getWord(callback){
  http.get("http://randomword.setgetgo.com/get.php", function(response){
    response.setEncoding('utf8');
    response.on('data', function(data){
      return(callback(data));
      });
    });
}

module.exports = router;
