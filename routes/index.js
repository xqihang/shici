var express = require('express');
var router = express.Router();

var WEBSITE = require('../config/website');
// api Service
var apiService = require('../service/api');

var extend = require('node.extend');
function translate(html){
	return html.replace(/\n\n/g,'</p><div class="ui hidden divider"></div><p>').replace(/\n/g,'</p><p>');
}

function renderData(item){

	item.createdAt = moment( item.createdAt ).fromNow();
	item.updatedAt = moment( item.updatedAt ).fromNow();

	item.content = translate( item.content );

	return item;
}
// Moment 格式化日期
var moment = require('moment');

moment.locale('zh-cn');

router.use(function(req, res,next){
	res.isLogin = ( req.cookies.token && req.cookies.token != 'undefined' ) ? true : false;
    next();
})

/* 主页 */
router.get('/', function(req, res, next) {
	apiService.list(function(results){
		for( var i = 0; i< results.length; i++ ){
			results[i] = renderData(results[i]);
		}
		
		res.render( 'index', {
			isLogin: res.isLogin,
			title: '首页',
			website: WEBSITE.name,
			data : results
		});
	},function(err){
		res.render( 'index', {
			title: '首页',
			website: WEBSITE.name
		});
	});
});

router.get('/about', function(req, res, next) {
	res.render('about', {
		isLogin: res.isLogin,
		title: '关于 [' + WEBSITE.name + ']这个项目',
		website: WEBSITE.name
	});
});

router.get('/audio', function(req, res, next) {

	var spide = require('rssspider');
	var url = 'http://www.lizhi.fm/rss/1565925.xml';
	spide.fetchRss(url).then(function(data){
	    res.render('audio', { isLogin: res.isLogin, title: '墨凡说电台', items: data});
	});
});

router.get('/u/:userid', function(req, res, next) {
	apiService.findByUserId(req.params.userid, function(results){
		for( var i = 0; i< results.length; i++ ){
			results[i] = renderData(results[i]);
		}

		res.render( 'index', {
			isLogin: res.isLogin,
			title : '诗人',
			website: results[0].user.username.toUpperCase() + ' : ' + results.length + '篇 - ' + WEBSITE.name,
			data : results
		});
	},function(err){
		res.render( 'index', {
			isLogin: res.isLogin,
			title : '没有找到此用户哦~',
			website: WEBSITE.name
		});
	});
});

router.get('/write/:id', function(req, res, next) {
	
	apiService.findById( req.params.id, function(result, comments, likes){

		result = renderData( result );

		res.render( 'article', {
			isLogin: res.isLogin,
			title : result.title,
			website: WEBSITE.name,
			data: result,
			code: 1,
			id: req.params.id,
			comments: comments.toString(),
			likes: likes
		});
	},function(){
		res.render( 'article', {
			isLogin: res.isLogin,
			title : '未曾寻到相关文献',
			website: WEBSITE.name,
			code: 0,
			msg: '未曾寻到阁下所寻之物~'
		} );
	});
});

router.get('/signup', function(req, res, next) {
	if( req.cookies.token && req.cookies.token != 'undefined' ){
        res.redirect(301,'/user/index');
    }

    res.render('signup', {
    	isLogin: res.isLogin,
		title : '注册',
		website: WEBSITE.name,
        appid : WEBSITE.appid,
        appkey : WEBSITE.appkey
	});
});

router.get('/login', function(req, res, next) {
	if( req.cookies.token && req.cookies.token != 'undefined' ){
        res.redirect(301,'/user/index');
    }
    res.render('login', {
    	isLogin: res.isLogin,
		title : '登录',
		website: WEBSITE.name,
        appid : WEBSITE.appid,
        appkey : WEBSITE.appkey
	});
});

router.get('/readme',function(req, res, next){
	res.render('readme',{
		isLogin: res.isLogin,
		title : '有一些事情，你需要知道',
		website: WEBSITE.name
	});
})

module.exports = router;