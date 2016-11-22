var express = require('express');
var router = express.Router();

// api Service
var apiService = require('../service/api');
var WEBSITE = require('../config/website');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.use(function(req, res, next){
    if( !req.cookies.token || req.cookies.token == 'undefined' ){
        res.redirect(301,'/login');
    }
    next();
})

router.get('/index', function(req, res, next) {
    apiService.currentUser(req.cookies.token, function(result){
        res.render('user/index',{
            website : WEBSITE.name,
            title : '用户中心',
            userInfo : result,
            action : req.query.action
        });
    },function(err){
        res.render('user/index',{
            title : '用户中心'
        });
    });
});

router.get('/create', function(req, res, next) {
    res.render('create', {
        title: '发布一条新作品'
    });
});

module.exports = router;