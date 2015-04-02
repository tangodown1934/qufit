/**
 * Created by yuhyeongjun on 15. 3. 23..
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res, next){
  res.render('charts', { title : 'charts' });
});

// print JSON data
router.get('/data', function(req, res, next){
  var jsonPath = path.join(__dirname, '../dummy.json')
  var obj= JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  res.json(obj);
});



module.exports = router;
