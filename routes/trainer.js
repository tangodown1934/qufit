var express = require('express');
var router = express.Router();
var trainer = require('../lib/trainer.js');

router.get('/class/:classId/option/:optionId', function(req, res, next){
  trainer.inquiry(req, res, next);
});

module.exports = router;