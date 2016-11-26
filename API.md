# **API 详细说明**

所有api都以  `http://write.freelion.me/api/v1/` 为基础路径

---

### GET `/` 

> api 首页

### GET `/write` 

> 获取所有诗词
> 返回实例： `{"code":1,"data":[{},{}],"msg":""}`

### POST `/write` 

> 新增一篇诗词
> 接受post参数
> 
> * "title" : 诗词的标题
> * "content" : 诗词的内容
> * "cc" : cc协议
> * "public": 是否公开

### GET `/write/:id` 

> 根据`id`获取指定的诗词
> 返回实例： `{"code":1,"data":{},"msg":""}`

### GET `/u/:id` 

> 根据`id`获取指定作者的诗词列表
> 返回实例： `{"code":1,"data":[{},{}],"msg":""}`

### GET `/comments/:id` 

> 根据`诗词id`获取指定诗词的评论列表
> 返回实例： `{"code":1,"data":[{},{}],"msg":""}`

### POST `/comment` 

> 新增一篇评论
> 接受post参数
> 
>* "articleid" : 诗词id
>* "action" : "comment"
>* "comment" : 评论内容

### POST `/signup` 

> 注册
> 接受post参数
> 
>* username : 用户名
>* passwd : 密码
>* email : 邮箱

### POST `/login` 

> 登录
> 接受post参数
> 
>* username : 用户名
>* passwd : 密码

### POST `/update_user` 

> 更新当前用户的信息
> 接受post参数
> 
>* username : 用户名
>* sex : 性别（0默认,1男，2女）
>* email : 邮箱地址
>* description: 简介
>* public : 是否公开作品

