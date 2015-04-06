var express = require('express');
var async = require('async');
var validator = require('validator');
var error = require('./error.js');

function inquiry(req, res, next){
  var classId = req.params.classId;
  var optionId = req.params.optionId;
  var resultJSON;

  // class id validation
  if(!validator.isNumeric(classId)){
    var err = error.notFound('Class id not matched');
    return next(err);
  }
  else if(!validator.isNumeric(optionId)){
    var err = error.notFound('Option id not matched');
    return next(err);
  }

  // option id 분기해서 처리
  console.log("option id : "+optionId);
  resultJSON = { success : true };

  switch (optionId){
    case '0':
      getGender(classId, function(err, data){
        if(err)
          return next(err);

        resultJSON.result = data;
        return res.json(resultJSON);
      });
      break;
    case '1':

      break;

    case '2':
      break;

    default:
      resultJSON.success = false;
      resultJSON.result = null;

      return res.json(resultJSON);
      break;
  }
}

function getGender(classId, callback) {
  var resultJSON = null;
  var femaleQuery = "SELECT COUNT(*) as FEMALE FROM FITCLASS_PAYMENT WHERE PAYMENT_GENDER='female' and PAYMENT_FITCLASS_ID=?;";
  var maleQuery = "SELECT COUNT(*) as MALE FROM FITCLASS_PAYMENT WHERE PAYMENT_GENDER='male' and PAYMENT_FITCLASS_ID=?;";

  async.parallel([
    function(callback) {
      process.nextTick(function () {
        dbPool.getConnection(function (err, connection) {
          if (err) {
            connection.release();
            callback(err, null);
          }

          global.dbPool.query(femaleQuery, [classId], function (err, results) {
            connection.release();
            if (err) {
              callback(err, null);
            }

            callback(null, results[0].FEMALE);
          });

        });
      });
    }, function(callback){
      process.nextTick(function(){
        dbPool.getConnection(function(err, connection) {
          if (err) {
            connection.release();
            callback(err, null);
          }

          global.dbPool.query(maleQuery, [classId], function (err, results) {
            connection.release();
            if(err) {
              callback(err, null);
            }

            callback(null, results[0].MALE);
          });
        });
      });
    }], function(err, results){
    if (err)
      callback(err, null);

    resultJSON = {
      female : results[0],
      male : results[1]
    };

    callback(null, resultJSON);
  });
}

module.exports = {
  inquiry : inquiry
};