var express = require('express');
var router = express.Router();

var WEBSITE = require('../config/website');
// api Service
var apiService = require('../service/api');

// Moment 格式化日期
var moment = require('moment');

router.use(function(req, res, next){
	res.token = req.cookies.token;
	next();
})

/* 主页 */
router.get('/', function(req, res, next) {
	apiService.list(function(results){
		for( var i = 0; i< results.length; i++ ){
			results[i].createdAt = moment( results[i].createdAt ).format('YYYY-MM-DD HH:mm');
		}
		
		res.render( 'index', {title: WEBSITE.name, data : results} );
	},function(err){
		res.render( 'index', {title:WEBSITE.name});
	});
});

router.get('/write/:id', function(req, res, next) {
	
	apiService.findById( req.params.id, function(result){
		result.createdAt = moment( result.createdAt ).format('YYYY-MM-DD HH:mm');
		res.render( 'article', {title: WEBSITE.name, data: result, code: 1} );
	},function(){
		res.render( 'article', {title: WEBSITE.name, code: 0, msg: '未曾寻到阁下所寻之物~'} );
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

router.get('/readme',function(req, res, next){
	res.render('readme',{
		title : '有一些事情，你需要知道',
		site : {
			name : WEBSITE.name
		}
	});
})

module.exports = router;