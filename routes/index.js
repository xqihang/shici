var express = require('express');
var router = express.Router();

var WEBSITE = require('../config/website');
// api Service
var apiService = require('../service/api');

var extend = require('node.extend');
var resData = {
	website: WEBSITE.name
};

// Moment 格式化日期
var moment = require('moment');

router.use(function(req, res,next){
	var isLogin = ( req.cookies.token && req.cookies.token != 'undefined' ) ? true : false;
    resData = extend(resData, {
    	isLogin: isLogin
    });
    next();
})

/* 主页 */
router.get('/', function(req, res, next) {
	apiService.list(function(results){
		for( var i = 0; i< results.length; i++ ){
			results[i].createdAt = moment( results[i].createdAt ).format('YYYY-MM-DD HH:mm');
		}

		resData = extend(resData, {
			data : results
		});
		
		res.render( 'index', resData );
	},function(err){
		res.render( 'index', {title:WEBSITE.name});
	});
});

router.get('/write/:id', function(req, res, next) {
	
	apiService.findById( req.params.id, function(result){
		result.createdAt = moment( result.createdAt ).format('YYYY-MM-DD HH:mm');

		resData = extend(resData, {
			data: result,
			code: 1
		});
		res.render( 'article', resData );
	},function(){
		resData = extend(resData, {
			code: 0,
			msg: '未曾寻到阁下所寻之物~'
		});
		res.render( 'article', resData );
	});
});

router.get('/signup', function(req, res, next) {
	if( req.cookies.token && req.cookies.token != 'undefined' ){
        res.redirect(301,'/user/index');
    }

    resData = extend(resData, {
		title : '注册',
        appid : WEBSITE.appid,
        appkey : WEBSITE.appkey
	});
    res.render('signup', resData);
});

router.get('/login', function(req, res, next) {
	if( req.cookies.token && req.cookies.token != 'undefined' ){
        res.redirect(301,'/user/index');
    }

    resData = extend(resData, {
		title : '登录',
        appid : WEBSITE.appid,
        appkey : WEBSITE.appkey
	});
    res.render('login', resData);
});

router.get('/readme',function(req, res, next){
	resData = extend(resData, {
		title : '有一些事情，你需要知道'
	});
	res.render('readme',resData);
})

module.exports = router;