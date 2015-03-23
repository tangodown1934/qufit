var express = require('express');
var router = express.Router();

var calc = require('../calc.js')
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Qufit' });
  res.json({success : 0});
});

/* Example */

router.get('/calc', function(req, res, next){
  var sum = calc.sum(4,2);
  res.send("Result of sum : "+sum);
});

router.get('/charts', function(req, res, next){
  res.render('charts', { title : 'charts' });
});

module.exports = router;
