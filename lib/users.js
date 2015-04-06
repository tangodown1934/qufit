/**
 * Created by yuhyeongjun on 15. 3. 30..
 */
var express = require('express');
var async = require('async');
var validator = require('validator');
var error = require('./error.js');

// 시간 형식을 처리하기 위해서
function convertDateTime(datetime) {
  if(datetime === null)
    return datetime;
  return datetime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

function getGenderCount(req, res, next){
  async.parallel([function(callback) {
    process.nextTick(function() { // io작업시 단일스레드 극복위해 우선수위
      global.dbPool.getConnection(function (err, connection) {
        if (err) {
          return next(err);
        }

        var queryFemale = "select COUNT(USER_ID) as COUNT from USER where USER_GENDER='female';"

        connection.query(queryFemale, function (err, rows, fields) {
          if (err) {
            connection.release();
            return next(err);
          }

          if(rows.length==0){
            var err = error.notFound('There is no data');
            return next(err);
          }

          connection.release();
          console.log(rows[0].COUNT);
          callback(null, rows[0].COUNT);
        });
      });
    });
  }, function(callback){
    process.nextTick(function() { // io작업시 단일스레드 극복위해 우선수위
      global.dbPool.getConnection(function (err, connection) {
        if (err) {
          return next(err);
        }

        var queryMale = "select COUNT(USER_ID) as COUNT from USER where USER_GENDER='male';";

        connection.query(queryMale, function (err, rows, fields) {
          if (err) {
            connection.release();
            return next(err);
          }

          if(rows.length==0){
            var err = error.notFound('There is no data');
            return next(err);
          }

          connection.release();
          callback(null, rows[0].COUNT);
        });
      });
    });
  }], function(err, results) {
    if(err)
      return next(err);

    var resJSON = {
      "cols": [
        {"id": "", "label": "Gender", "pattern": "", "type": "string"},
        {"id": "", "label": "Count", "pattern": "", "type": "number"}
      ],
      "rows": [
        {"c":[{"v":"여자","f":null},{"v":results[0],"f":null}]},
        {"c":[{"v":"남자","f":null},{"v":results[1],"f":null}]}
      ]
    };

    return res.json(resJSON);
  });
};

function getUser(req, res, next){
  var id = req.params.id;

  if(id == undefined) {
    var err = error.notFound('Param is not found');
    return next(err);
  }
  // id validation
  if(!validator.isNumeric(id)){
    var err = error.notFound('Input\'s type is not matched');
    return next(err);
  }

  global.dbPool.getConnection(function(err, connection){
    if(err) {
      connection.release();
      return next(err);
    }

    var query = "select * from USER where USER_ID = ?";
    connection.query(query, [id], function(err, rows, fields){
      connection.release();

      if(err){
        return next(err);
      }

      if(rows.length==0){
        var err = error.notFound('There is no data');
        return next(err);
      }

      var user = rows[0];
      var resJSON = {
        "success" : true,
        "result" : {
          "id" : user.USER_ID,
          "name" : user.USER_NAME,
          "email" : user.USER_EMAIL,
          "phon" : user.USER_PHON
        }
      };

      return res.json(resJSON);
    });
  });
}

function getAllUser(req, res, next){
  async.waterfall([function(callback) {
    process.nextTick(function () { // io작업시 단일스레드 극복위해 우선수위
      global.dbPool.getConnection(function (err, connection) {

        if (err) {
          return next(err);
        }

        var query = "select * from USER";
        var res = [];  //옵션 리스트를 저장할 배열

        connection.query(query, function (req, rows, fields) {
          if (err) {
            connection.release();
            return next(err);
          }

          // 루프!
          async.each(rows, function (row, callback) {
            var tmp = {
              "name":row.USER_NAME,
              "email":row.USER_EMAIL,
              "phone":row.USER_PHON,
              "intro":row.USER_INTRO,
              "gender":row.USER_GENDER
            };
            res.push(tmp);
            callback();
          }, function (err) {
            connection.release();

            if (err)
              return next(err);

            callback(null, res);
          });
        });
      });
    });
  }], function(err, result) {
    //결과 전송
    if (err) {
      return next(err);
    }

    return res.json({
      "success": true,
      "result": result
    });
  });
}

module.exports = {
  getAllUser : getAllUser,
  getUser : getUser,
  getGenderCount : getGenderCount
};
