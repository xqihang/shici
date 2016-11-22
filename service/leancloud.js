var WEBSITE = require('../config/website');
var AV = require('leancloud-storage');

// curl Request
var request = require('request');

AV.init({
    appId: WEBSITE.appid,
    appKey: WEBSITE.appkey
});

var table = {
    'art': 'article',
    'user': 'users'
}

module.exports = {
    list: function(cb, err) {
        var query = new AV.Query(table['art']);
        query.descending("createdAt");
        query.find().then(function(results) {
            cb && cb(results);
        }, function(error) {
            err && err(error);
        })
    },
    findById: function(id, success, err) {
        var query = new AV.Query(table['art']);
        query.get(id).then(function(result) {
            success && success(result);
        }, function(error) {
            err && err(error);
        })
    },
    createNew: function(data, success, err) {

        var Article = AV.Object.extend(table['art']);

        // 新建对象
        var one = new Article();

        for (var name in data) {
            one.set(name, data[name]);
        }
        one.save().then(function(result) {
            success && success(result);
        }, function(error) {
            err && err(error);
        })
    },
    signup: function(data, success, err) {
        request({
            url: 'https://api.leancloud.cn/1.1/users', 
            method: 'POST',
            headers: { 
                "X-LC-Id": WEBSITE.appid,
                "X-LC-Key": WEBSITE.appkey
            },
            json: {
                "username": data.username,
                "password": data.passwd,
                "email": data.email
            }
        },function(error, res, body) {
            if (body.code) {
                err && err(body);
                return false;
            }
            success && success(body);
        });
    },
    login: function(data, success, err) {
        request({
            url: 'https://api.leancloud.cn/1.1/login', 
            method: 'POST',
            headers: { 
                "X-LC-Id": WEBSITE.appid,
                "X-LC-Key": WEBSITE.appkey
            },
            json: {
                "username": data.username,
                "password": data.passwd
            }
        },function(error, res, body) {
            if (body.code) {
                err && err(body);
                return false;
            }
            success && success(body);
        });
    },
    currentUser:function(token, success, err){
        request({
            url: 'https://api.leancloud.cn/1.1/users/me', 
            method: 'GET',
            headers: {
                "X-LC-Id": WEBSITE.appid,
                "X-LC-Key": WEBSITE.appkey,
                "X-LC-Session": token
            }
        },function(error, res, body) {
            body = JSON.parse(body);
            if (body.code) {
                err && err(body);
            }
            success && success(body);
        });
    }
}
