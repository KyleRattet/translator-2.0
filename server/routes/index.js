var express = require('express');
var router = express.Router();
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

module.exports = router;
