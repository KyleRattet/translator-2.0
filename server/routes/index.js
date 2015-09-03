var express = require('express');
var router = express.Router();
var keys = require('../../keys.js');

var bt = require('bing-translate').init({
    client_id: keys.id,
    client_secret: keys.secret
  });


router.get('/', function(req, res, next) {
  // var array = GetLanguagesForTranslate();
  // console.log(array);
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  bt.translate(req.body.name, 'en', 'es', function(err, translated){
  if (err) {
    res.json(err);
  } else {
    res.send(translated.translated_text);
  }
  });
});

module.exports = router;
