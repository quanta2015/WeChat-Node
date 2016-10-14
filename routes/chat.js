var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('chat', {});
});

router.post('/getUserList', function(req, res, next) {
  dbHelper.findUserList(req.body, function (success, data) {
    res.send(data);
  })
});

router.post('/getFriendList', function(req, res, next) {
  dbHelper.getFriendList(req.body, function (success, data) {
    res.send(data);
  })
});

router.post('/addFriend', function(req, res, next) {

  dbHelper.addFriend(req.body, function (success, data) {
    res.send(data);
  })
});

router.post('/getOfflineMsg', function(req, res, next) {

  dbHelper.getOfflineMsg(req.body, function (success, data) {
    res.send(data);
  })
});

router.post('/setOfflineMsg', function(req, res, next) {

  dbHelper.setOfflineMsg(req.body, function (success, data) {
    res.send(data);
  })
});


module.exports = router;
