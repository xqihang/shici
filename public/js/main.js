$(function(){
	$('.ui.dropdown').dropdown();

	var createNew = new Vue({
		el : '#create-shici',
		data : {
			title : '',
			content : '',
			public: true,
			select_cc : 0,
			message: '',
			status : true,
			cc : [
				{
					name : '',
					zh : '无'
				},
				{
					name : 'by-nc-nd',
					zh : '署名-非商业使用-禁止演绎'
				},
				{
					name : 'by-nc-sa',
					zh : '署名-非商业性使用-相同方式共享'
				},
				{
					name : 'by-nc',
					zh : '署名-非商业性使用'
				},
				{
					name : 'by-nd',
					zh : '署名-禁止演绎'
				},
				{
					name : 'by-sa',
					zh : '署名-相同方式共享'
				},
				{
					name : 'by',
					zh : '署名'
				}
			]
		},
		methods : {
			creat : function(){
				var _t = this;
				if( _t.title == '' || _t.content == '' ){
					_t.message = '请阁下认真对待...';
					_t.status = false;
					return false;
				}
				$.post('/api/v1/write',{
					"title" : _t.title,
					"content" : _t.content,
					"cc" : _t.cc[ _t.select_cc ].name,
					"public": _t.public
				},function(res){
					_t.message = '创建成功... <a href="/write/'+res.data.objectId+'">即刻查看</a>';
					_t.status = true;
					_t.title = '';
					_t.content = '';
				})
			},
			toggle : function(){
				$('.dropdown-cc').dropdown();
			},
			selectCC : function(name){
				var _cc = this.cc;
				for( var i = 0; i < _cc.length; i++ ){
					if( name == _cc[i].name ){
						this.select_cc = i;
					}
				}
			},
			closeMsg : function(){
				this.message = '';
			}
		}
	});
});