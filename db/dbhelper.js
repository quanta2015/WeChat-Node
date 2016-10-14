/**
 * Created by liyang on 2016/10/6.
 */
var entries = require('./jsonRes');
var mongoose = require('./db.js');
var config = require('../config')
var async = require('async');

var User = require('./schema/user');
var Friend = require('./schema/friend');
var Message = require('./schema/message');


var PAGE_SIZE = config.site.pagesize;

exports.findUsr = function(data, cb) {

    User.findOne({
        username: data.usr
    }, function(err, doc) {
        var user = (doc !== null) ? doc.toObject() : '';

        if (err) {
            console.log(err)
        } else if (doc === null) {
            entries.code = 99;
            entries.msg = '用户名错误！';
            cb(false, entries);
        } else if (user.password !== data.pwd) {
            entries.code = 99;
            entries.msg = '密码错误！';
            cb(false, entries);
        } else if (user.password === data.pwd) {
            entries.data = user;
            entries.code = 0;
            cb(true, entries);
        }
    })
}

exports.addUser = function(data, cb) {

    var user = new User({
        username: data.usr,
        password: data.pwd,
        email: data.email,
        adr: data.adr
    });

    user.save(function(err, doc) {
        if (err) {
            cb(false, err);
        } else {
            cb(true, entries);
        }
    })
};


exports.findUserList = function (data, cb) {

    var uid =  data.uid;

    User.find().exec(function(err, docs) {

        var userList=new Array();
        for(var i=0;i<docs.length;i++) {
            if ( uid != docs[i].id) {
                userList.push(docs[i].toObject());
            }
        }
        cb(true,userList);
    });
}

exports.getFriendList = function (data, cb) {

    var uid =  data.uid;

    Friend.find({'uid':uid})
        .populate('fid')
        .exec(function(err, docs) {

        var friendList=new Array();
        for(var i=0;i<docs.length;i++) {
           friendList.push(docs[i].toObject());
        }
        cb(true, friendList);
    });
}

exports.addFriend = function(data, cb) {

    var friend1 = new Friend({ uid: data.uid, fid: data.fid });
    var friend2 = new Friend({ uid: data.fid, fid: data.uid });


    async.parallel({
        one: function(callback) {
            friend1.save(function(err, doc) {
                callback(null, doc);
            })
        },
        two: function(callback) {
            friend2.save(function(err, doc) {
                callback(null, doc);
            })
        }
    }, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        cb(true, entries);
    });
};

exports.addMsg = function(data, cb) {

    var message_me = new Message({
        uid: data.uid,
        from: data.from,
        to: data.to,
        type: config.site.ONLINE,
        msg: data.msg
    });
    var message_frd = new Message({
        uid: data.to,
        from: data.from,
        to: data.to,
        type: data.type,
        msg: data.msg
    });

    async.parallel({
        one: function(callback) {
            message_me.save(function(err, doc) {
                callback(null, doc);
            })
        },
        two: function(callback) {
            message_frd.save(function(err, doc) {
                callback(null, doc);
            })
        }
    }, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        cb(true, entries);
    });
};



exports.getOfflineMsg = function (data, cb) {

    var uid =  data.uid;

    Message.find({'uid':uid, 'type':'1'})
        .populate('from')
        .exec(function(err, docs) {
            var messageList=new Array();
            for(var i=0;i<docs.length;i++) {
                messageList.push(docs[i].toObject());
            }
            cb(true, messageList);
        });
}

exports.setOfflineMsg = function (data, cb) {

    var uid = data.uid;
    var fid = data.fid;

    var conditions = {'uid':uid, 'from':fid, 'type':'1'};
    var update = {$set :{ 'type' : '0'}};
    var options = { multi: true };

    Message.update(conditions,update,options, function(error,data){
        if(error) {
            console.log(error);
        }else {
            data.id = fid;
            cb(true, data);

        }
    })

}
