var express = require('express');
var router = express.Router();

// api Service
var apiService = require('../service/api');
var WEBSITE = require('../config/website');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/index', function(req, res, next) {
    if( !req.cookies.token || req.cookies.token == 'undefined' ){
        res.redirect(301,'/user/login');
        return false;
    }
    apiService.currentUser(req.cookies.token, function(result){
        res.render('user/index',{
            website : WEBSITE.name,
            title : '用户中心',
            data : result,
            action : req.query.action
        });
    },function(err){
        res.render('user/index',{
            title : '用户中心'
        });
    });
});

router.get('/signup', function(req, res, next) {
    res.render('signup',{
    	title : '注册',
        appid : WEBSITE.appid,
        appkey : WEBSITE.appkey
    });
});

router.get('/login', function(req, res, next) {
    res.render('login',{
    	title : '登录',
        appid : WEBSITE.appid,
        appkey : WEBSITE.appkey
    });
});

router.get('/create', function(req, res, next) {
    res.render('create', {
        title: '发布一条新作品'
    });
});

module.exports = router;