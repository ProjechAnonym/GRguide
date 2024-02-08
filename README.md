# GRguide
一个高度自定义的导航站
# GRguide
一个高度自定义的导航站
## 技术栈
项目采用前后分离的形式,前端由react开发,后端则是gin框架,gin监听8082端口
## 前端配置
前端配置文件在/src/assets下的config.js
```javascript
{
  API: "https://example.com/api" //后端API,api路径为必须的
  HeFengKey: "" //和风天气的key
  GaodeKey: "" //高德的key
  geoAPI: "https://restapi.amap.com/v3/ip"
  locationIDAPI: "https://geoapi.qweather.com/v2/city/lookup"
  liveWeatherAPI: "https://devapi.qweather.com/v7/weather/now"
  forcastWeatherAPI: "https://devapi.qweather.com/v7/weather/24h"
  searchEngine: [
    {
      label: "web" // 搜索引擎的组名
      groupValue: [ //组的值
        { searchlabel: "bing", searchvalue: "https://www.bing.com/search?q=" }
        {
          searchlabel: "google"
          searchvalue: "https://www.google.com/search?q="
        },
        {
          searchlabel: "baidu"
          searchvalue: "https://www.baidu.com/s?wd="
        }
      ]
    }
  ]
}
```
## 后端配置
```yaml
MariaDb:
  addr: 127.0.0.1
  port: 3306
  database: "ginGuide"
  user: "root"
  password: ""
SMTP:
  host: "smtp.qq.com"
  port: 25
  username: ""
  password: ""
Redis:
  addr: "127.0.0.1:6379"
  password: ""
  DB: 0
Cors:
# cors是跨域配置,此处写你用于访问的域名即可
  origin: "http://localhost:3000"
# api和在前端配置文件中填写的一致
API:
  host: "http://127.0.0.1:8080/api"
```
## 环境依赖
### 后端
后端依赖redis作账号找回的身份验证功能
### 前端
前端需要在下载nodejs的环境中打包,打包后的文件可以由nginx部署
以下是nginx的示例,后端服务器部署在192.168.50.5机器上,监听8082端口
```
server {
	listen       8443 ssl;
	listen		 [::]:8443 ssl; 
	server_name  nav.lzhlovelcl.top;
	ssl_certificate      /opt/nginx/config/ssl/public.pem;
	ssl_certificate_key  /opt/nginx/config/ssl/private.key;

	ssl_session_cache    shared:SSL:1m;
	ssl_session_timeout  5m;

	ssl_ciphers  HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers  on;
# 默认在html下的build目录中索引index.html文件
  root   html/build;
	index  index.html index.htm;
	location / {
    # 此字段可以实现直接带有uri访问,否则nginx会报找不到文件
    try_files $uri $uri/ /index.html;
  }
  
}

server {
	listen       8443 ssl;
	listen		 [::]:8443 ssl;
  # 后端api的域名,和前端api写的域名是一致的
	server_name  navapi.lzhlovelcl.top;
	ssl_certificate      /opt/nginx/config/ssl/public.pem;
	ssl_certificate_key  /opt/nginx/config/ssl/private.key;

	ssl_session_cache    shared:SSL:1m;
	ssl_session_timeout  5m;

	ssl_ciphers  HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers  on;

	location / {
    proxy_pass http://192.168.50.5:8082;
  }
  
}
```
