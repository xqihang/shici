var express = require('express');
var router = express.Router();

// api Service
var apiService = require('../service/api');
var WEBSITE = require('../config/website');

var extend = require('node.extend');
var resData = {
    website : WEBSITE.name,
    title: WEBSITE.name
};

router.use(function(req, res,next){
    var isLogin = ( req.cookies.token && req.cookies.token != 'undefined' ) ? true : false;
    resData = extend(resData, {
        isLogin: isLogin
    });
    next();
})

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.use(function(req, res, next){
    if( !req.cookies.token || req.cookies.token == 'undefined' ){
        res.redirect(301,'/login');
    }
    next();
});

router.get('/index', function(req, res, next) {
    apiService.currentUser(req.cookies.token, function(result){
        resData = extend(resData, {
            title : '用户中心',
            userInfo : result,
            action: req.query.action || 'login'
        });
        res.render('user/index', resData);
    },function(err){
        resData = extend(resData,{
            title : '用户中心',
            action : req.query.action
        });
        res.render('user/index', resData);
    });
});

router.get('/create', function(req, res, next) {
    resData = extend(resData, {
        title: '发布一条新作品'
    });
    res.render('create', resData);
});

router.all('/logout', function(req, res, next) {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;