var WEBSITE = require('../config/website');
var AV = require('leancloud-storage');
// Moment 格式化日期
var moment = require('moment');

moment.locale('zh-cn');

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
    findByUserId: function(userid, cb, err) {
        
        var query = new AV.Query(table['art']);
        var withUser = AV.Object.createWithoutData('_User', userid);
        query.equalTo('user', withUser);
        query.descending("updatedAt");
        query.include('user');
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
            // 日期倒序
            queryComment.descending('createdAt');

            queryComment.equalTo('article', article);
            queryComment.equalTo('action', 'comment');

            queryComment.include('user');

            queryComment.find().then(function(comments){

                var commentsArr = [];
                for( var i = 0; i < comments.length; i++ ){
                    var tmp = comments[i]._serverData;
                    tmp.user = tmp.user._serverData;
                    tmp.date = moment(comments[i].updatedAt).fromNow();
                    commentsArr.push( JSON.stringify(tmp) );
                }

                success && success(result._serverData, commentsArr);
            },function(error){
                success && success(result._serverData);
            });
        }, function(error) {
            err && err(error);
        })
    },
    comments: function(id, success, err){
        var queryComment = new AV.Query('event');

        // 只查询留言
        queryComment.equalTo('action', 'comment');
        // 判断是否查询全部
        if( id != 'all' ){
            var article = AV.Object.createWithoutData('article', id);
            queryComment.equalTo('article', article);
        }
        // 日期倒序
        queryComment.descending('createdAt');
        // 关联用户信息查询
        queryComment.include('user');
        queryComment.include('article');

        queryComment.find().then(function(comments){

            var commentsArr = [];
            for( var i = 0; i < comments.length; i++ ){
                var tmp = comments[i]._serverData;
                tmp.user = tmp.user._serverData;
                tmp.date = moment(comments[i].updatedAt).fromNow();
                commentsArr.push( tmp );
            }
            success && success(commentsArr);
        },function(error){
            err && err(error);
        });
    },
    event : function(data, success, err){

        var _t = this;
        var Event = AV.Object.extend(table['event']);
        var one = new Event();

        var user = AV.Object.createWithoutData('_User', data.userid);
        var author = AV.Object.createWithoutData('_User', data.author);
        var article = AV.Object.createWithoutData('article', data.articleid);
        one.set('user', user );
        one.set('author', author );
        one.set('article', article );

        one.set('action', data.action );
        if( data.action == 'comment' ){
            one.set('comment', data.comment );
        }

        one.save().then(function() {
            _t.comments(data.articleid,function(results){
                success && success(results);
            })
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
            
            if(name == 'public'){
                one.set(name, Boolean(data[name]) );
            }else{
                one.set(name, data[name]);
            }
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
    currentUser: function(token, success, err){
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

            var queryEvent = new AV.Query(table['event']);
            queryEvent.equalTo('author', withUser);

            query.find().then(function(data) {
                return data;
            }).then(function(data){
                queryEvent.find().then(function(eventlist){
                    success && success(body, data, eventlist );
                })
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
