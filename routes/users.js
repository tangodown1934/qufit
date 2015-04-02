var express = require('express');
var router = express.Router();
var users = require('../lib/users.js');

/* GET users listing. */
router.get('/', function(req, res, next){
  users.getAllUser(req, res, next);
});

router.get('/gender', function(req, res, next){
  users.getGenderCount(req, res, next);
});

router.get('/:id', function(req, res, next){
  users.getUser(req, res, next);
});


module.exports = router;
