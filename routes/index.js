var express = require('express');
var router = express.Router();

var WEBSITE = require('../config/website');
// api Service
var apiService = require('../service/api');

var extend = require('node.extend');
var resData = {
	website: WEBSITE.name,
	title: WEBSITE.name
};
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
			results[i] = renderData(results[i]);
		}

		resData = extend(resData, {
			title: '首页',
			data : results
		});
		
		res.render( 'index', resData );
	},function(err){
		resData = extend(resData, {
			title : '首页'
		});
		res.render( 'index', resData );
	});
});

router.get('/about', function(req, res, next) {
	resData = extend(resData, {
		title : '关于 [' + WEBSITE.name + ']这个项目'
	});
	res.render('about', resData);
});

router.get('/audio', function(req, res, next) {

	var spide = require('rssspider');
	var url = 'http://www.lizhi.fm/rss/1565925.xml';
	spide.fetchRss(url).then(function(data){
	    res.render('audio', { title: '墨凡说电台', items: data});
	});
});

router.get('/u/:userid', function(req, res, next) {
	console.log(req.params.userid);
	apiService.findByUserId(req.params.userid, function(results){
		console.log(results);
		for( var i = 0; i< results.length; i++ ){
			results[i] = renderData(results[i]);
		}

		resData = extend(resData, {
			title : '诗人：' + results[0].user.username.toUpperCase(),
			data : results
		});
		
		res.render( 'index', resData );
	},function(err){
		resData = extend(resData, {
			title : '没有找到此用户哦~'
		});
		res.render( 'index', resData );
	});
});

router.get('/write/:id', function(req, res, next) {
	
	apiService.findById( req.params.id, function(result, comments){

		result = renderData( result );

		console.log(result);
		resData = extend(resData, {
			title : result.title,
			data: result,
			code: 1,
			id: req.params.id,
			comments: comments.toString()
		});

		res.render( 'article', resData );
	},function(){
		resData = extend(resData, {
			title : '未曾寻到相关文献',
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