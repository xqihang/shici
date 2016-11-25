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
    'user': 'users',
    'event': 'event'
}

module.exports = {
    list: function(cb, err) {
        var query = new AV.Query(table['art']);
        query.include('user');
        query.descending("createdAt");
        query.find().then(function(results) {
            var tmpResults = [];

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                // 并不需要网络访问
                var user = result.get('user');
                result._serverData.user = user._serverData;

                result._serverData.id = result.id;
                result._serverData.createdAt = result.createdAt;
                result._serverData.updatedAt = result.updatedAt;
                result._serverData.userid = user.id;

                tmpResults.push(result._serverData);
            }
            cb && cb(tmpResults);
        }, function(error) {
            err && err(error);
        })
    },
    findById: function(id, success, err) {
        var query = new AV.Query(table['art']);
        query.include('user');
        query.get(id).then(function(result) {

            var user = result.get('user');
            result._serverData.user = user._serverData;

            result._serverData.id = result.id;
            result._serverData.createdAt = result.createdAt;
            result._serverData.updatedAt = result.updatedAt;
            result._serverData.userid = user.id;

            var queryComment = new AV.Query('event');
            var article = AV.Object.createWithoutData('article', id);
            queryComment.equalTo('article', article);
            queryComment.equalTo('action', 'comment');
            queryComment.include('user');
            queryComment.find().then(function(comments){
                success && success(result._serverData, comments);
            },function(error){
                success && success(result._serverData);
            });
        }, function(error) {
            err && err(error);
        })
    },
    event : function(data, success, err){
        var Event = AV.Object.extend(table['event']);
        var one = new Event();

        var user = AV.Object.createWithoutData('_User', data.userid);
        var article = AV.Object.createWithoutData('article', data.articleid);
        one.set('user', user );
        one.set('article', article );

        one.set('action', data.action );
        if( data.action == 'comment' ){
            one.set('comment', data.comment );
        }

        one.save().then(function(result) {
            success && success(result);
        }, function(error) {
            console.log(error);
            err && err(error);
        })
    },
    createNew: function(data, userid, success, err) {

        var Article = AV.Object.extend(table['art']);

        // 新建对象
        var one = new Article();

        for (var name in data) {
            one.set(name, data[name]);
        }
        var user = AV.Object.createWithoutData('_User', userid);
        one.set('user', user );
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
        var _t = this;
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

            var query = new AV.Query(table['art']);
            var withUser = AV.Object.createWithoutData('_User', body.objectId);
            query.equalTo('user', withUser);
            query.descending("updatedAt");
            
            query.find().then(function(data) {
                success && success(body, data);
            });
        });
    },
    user: function(userid, token, data, success, err){
        data.public = Boolean(data.public);
        data.sex = parseInt(data.sex);
        request({
            url: 'https://api.leancloud.cn/1.1/users/'+userid, 
            method: 'PUT',
            headers: {
                "X-LC-Id": WEBSITE.appid,
                "X-LC-Key": WEBSITE.appkey,
                "X-LC-Session": token
            },
            json: data
        },function(error, res, body) {

            if (body.updatedAt) {
                success && success(body);
                return false;
            }

            err && err(body);
            
        });
    }
}
