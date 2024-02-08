# GRguide
一个高度自定义的导航站
# GRguide
一个高度自定义的导航站
## 技术栈
项目采用前后分离的形式,前端由react开发,后端则是gin框架
## 前端配置
前端配置文件在/src/assets下的config.js
```json
{
  API: "https://navapi.lzhlovelcl.top:8443/api",
  HeFengKey: "",
  GaodeKey: "",
  geoAPI: "https://restapi.amap.com/v3/ip",
  locationIDAPI: "https://geoapi.qweather.com/v2/city/lookup",
  liveWeatherAPI: "https://devapi.qweather.com/v7/weather/now",
  forcastWeatherAPI: "https://devapi.qweather.com/v7/weather/24h",
  searchEngine: [
    {
      label: "web",
      groupValue: [
        { searchlabel: "bing", searchvalue: "https://www.bing.com/search?q=" },
        {
          searchlabel: "google",
          searchvalue: "https://www.google.com/search?q=",
        },
        {
          searchlabel: "baidu",
          searchvalue: "https://www.baidu.com/s?wd=",
        },
      ],
    },
  ],
};

```
