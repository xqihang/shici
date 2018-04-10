var express = require('express');
var router = express.Router();

// Moment 格式化日期
var moment = require('moment');

// api Service
var apiService = require('../service/api');
var WEBSITE = require('../config/website');

router.use(function(req, res, next){
    console.log(req.cookies.token);
    if( !req.cookies.token || req.cookies.token == 'undefined' ){
        res.redirect(301,'/login');
    }else{
        res.isLogin = true;
    }
    next();
});

/* GET users listing. */
router.get('/index', function(req, res, next) {
    apiService.currentUser(req.cookies.token, function(result, list, eventlist){

        var likes = [];
        var comments = [];
        var eventArr = [];
        for(var i=0; i<eventlist.length;i++){
            var e = eventlist[i]._serverData;

            switch(e.action){
                case 'comment':
                    comments.push(e);
                    break;
                case 'likes':
                    likes.push(e);
                    break;
                default:
                    eventArr.push(e);
            }
        }
        res.render('users/index', {
            isLogin: res.isLogin,
            website: WEBSITE.name,
            title : '用户中心',
            userInfo : result,
            count : list.length,
            list : list,
            likes : likes,
            comments : comments,
            events: eventArr,
            action: req.query.action || ''
        });
    });
});

router.get('/event', function(req, res, next) {
    apiService.currentUser(req.cookies.token, function(result, list, eventlist){

        for(var i=0; i<eventlist.length;i++){
            var temp = eventlist[i]._serverData;
            temp.date = moment(eventlist[i].updatedAt).fromNow();
            eventlist[i] = temp;

            console.log(eventlist[i].article)
        }
        res.render('users/event', {
            isLogin: res.isLogin,
            website: WEBSITE.name,
            title : '互动消息',
            userInfo : result,
            count : list.length,
            list : list,
            events: eventlist
        });
    });
});

router.get('/push', function(req, res, next) {
    apiService.currentUser(req.cookies.token, function(result){
        res.render('users/write', {
            isLogin: res.isLogin,
            website: WEBSITE.name,
            title: '发布一条新作品',
            userInfo : result
        });
    });
});

router.get('/update', function(req, res, next) {
    apiService.currentUser(req.cookies.token, function(result){
        res.render('users/update', {
            isLogin: res.isLogin,
            title : '更新用户信息',
            website: WEBSITE.name,
            userInfo : result
        });
    });
});

router.all('/logout', function(req, res, next) {
    res.clearCookie('token');
    res.clearCookie('userid');
    res.redirect('/');
});

module.exports = router;