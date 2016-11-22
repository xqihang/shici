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

router.get('/', function(req, res, next) {
	res.send( message(1, result) );
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
	apiService.createNew(req.body, function(result){
		res.send( message(1, result) );
	},function(err){
		console.log(err);
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

router.post('/signup', function(req, res, next) {
	apiService.signup(req.body, function(result){
		res.cookie('token', result.sessionToken, { expires: cookieDate(36500) });
		res.send( message(1, result) );
	},function(err){
		res.send( message(0, err) );
	});
});

router.post('/login', function(req, res, next) {
	apiService.login(req.body, function(result){
		res.cookie('token', result.sessionToken, { expires: cookieDate(36500) });
		res.send( message(1, result) );
	},function(err){
		res.send( message(0, err) );
	});
});

router.use(function(req, res, next){
	res.send( message(-1) )
})

module.exports = router;
