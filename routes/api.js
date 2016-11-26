var express = require('express');
var router = express.Router();
// api Service
var apiService = require('../service/api');
// code对照表
var codeArr = require('../config/code');

function message(code, data){

	var res = {
		code : code
	};

	if( data ){
		res.data = data;
	}
	for(var i=0; i<codeArr.length; i++){
		if( codeArr[i].code == code ){
			res.msg = codeArr[i].msg;
		}
	}
	return res;
}

function cookieDate(days){
	var now = new Date();
	now.setDate(now.getDate()+days);
	return now;
}

function setCookie(res, objCookie){
	for(var name in objCookie){
		res.cookie( name, objCookie[name], { expires: cookieDate(36500) });
	}
}

router.get('/', function(req, res, next) {
	res.send( message(1, 'Api Index') );
});

router.use(function(req, res, next){
	console.log('Run in at time:' + new Date() );
	next();
})

router.get('/write', function(req, res, next) {
	apiService.list(function(result){
		res.send( message(1, result) );
	},function(err){
		res.send( message(0, err) );
	});
});

router.post('/write', function(req, res, next) {
	apiService.createNew(req.body, req.cookies.userid, function(result){
		res.send( message(1, result) );
	},function(err){
		res.send( message(-2, err) );
	});
});

router.get('/write/:id', function(req, res, next) {
	apiService.findById( req.params.id, function(result){
		res.send( message(1, result) );
	},function(){
		res.send( message(0, req.params.id) );
	});
});

router.get('/u/:id', function(req, res, next) {
	apiService.findByUserId( req.params.id, function(result){
		res.send( message(1, result) );
	},function(){
		res.send( message(0, req.params.id) );
	});
});

router.get('/comments/:id', function(req, res, next) {
	apiService.comments( req.params.id, function(results){
		res.send( message(1, results) );
	},function(err){
		res.send( message(-2, err) );
	});
});

router.post('/comment', function(req, res, next) {
	req.body.userid = req.cookies.userid;
	apiService.event(req.body, function(result){
		res.send( message(1, result) );
	},function(err){
		res.send( message(-2, err) );
	});
});

router.post('/signup', function(req, res, next) {
	apiService.signup(req.body, function(result){
		setCookie(res,{
			token : result.sessionToken,
			userid : result.objectId
		})
		res.send( message(1, result) );
	},function(err){
		res.send( message(0, err) );
	});
});

router.post('/login', function(req, res, next) {
	apiService.login(req.body, function(result){
		setCookie(res,{
			token : result.sessionToken,
			userid : result.objectId
		})
		res.send( message(1, result) );
	},function(err){
		res.send( message(0, err) );
	});
});

router.post('/update_user', function(req, res, next) {

	apiService.user(req.cookies.userid, req.cookies.token, req.body, function(result){
		res.send( message(1, result) );
	},function(err){
		res.send( message(0, err) );
	});
});

router.use(function(req, res, next){
	res.send( message(-1) )
})

module.exports = router;
