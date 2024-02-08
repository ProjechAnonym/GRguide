package controller

import (
	"encoding/json"
	"fmt"
	"ginproject/config"
	"ginproject/model"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/bitly/go-simplejson"
	"github.com/spf13/viper"
	"go.uber.org/zap"
)



func SubmmitWeb(id uint64, group string, name string, url string, icon string) (bool,error){
	// 获取用户信息,取用户名用于索引
	user := model.Users{ID: id}
	if err := config.Db.Take(&user).Error;err != nil{
		return false,err
	}
	// 将该用户要上传的网站变成orm对象上传
	guide := model.Website{Username: user.Username,Web_group: group,Name: name,Url: url,Icon: icon,UserID: id}
	if err := config.Db.Create(&guide).Error;err != nil{
		return false,err
	}

	return true,nil
}

func DeleteWeb(id uint64, group string, name string)(bool,error){
	group_name := url.QueryEscape(group)
	web_name := url.QueryEscape(name)
	viper.SetConfigName("config")
	viper.AddConfigPath(filepath.Join(config.GetGlobalValue("project_dir").(string),"/config"))
	viper.SetConfigType("yaml")
	viper.ReadInConfig()
	base_url := viper.Get("Api.host")
	var website model.Website
	if err1 := config.Db.Where("user_id = ? AND web_group = ? AND name = ?", id, group, name).First(&website).Error;err1 != nil{
		return false,err1
	}
	if regexp.MustCompile(fmt.Sprintf("%s/getpic/userid%d/%s/%s",base_url,id,group_name,web_name)).MatchString(website.Icon){
		file_path := strings.Split(website.Icon, "/")
		parse_web,err5 := url.QueryUnescape(file_path[len(file_path)-1]);
		if err5!=nil{
			zap.L().Error("删除图片失败",zap.Error(err5))
		}
		
		if err3 := os.Remove(fmt.Sprintf("%s/static/%s/%s/%s",config.GetGlobalValue("project_dir"),file_path[len(file_path)-3],group,parse_web));err3 != nil{
			zap.L().Error("删除图片失败",zap.Error(err3))
			return false,err3
		}
	}
	// 删除该用户指定的网址
	if err2 := config.Db.Where("user_id = ? AND web_group = ? AND name = ?", id, group, name).Delete(&model.Website{}).Error;err2 != nil{
		return false,err2
	}
	return true,nil
}

func DeleteWebGroup(id uint64, group string)(bool,error){
	if group == "link"{
		group = "userlinkgroup"
	}
	
	if _,err1 := os.Stat(fmt.Sprintf("%s/static/userid%d/%s",config.GetGlobalValue("project_dir"),id,group));err1 == nil{
		if err2 := os.RemoveAll(fmt.Sprintf("%s/static/userid%d/%s",config.GetGlobalValue("project_dir"),id,group));err2 != nil {
			zap.L().Error("删除组文件夹出错",zap.Error(err2))
			return false,err2
		}
	}
	// 删除该用户指定的网站分组
	if err3 := config.Db.Where("user_id = ? AND web_group = ?", id, group).Delete(&model.Website{}).Error;err3 != nil{
		return false,err3
	}
	return true,nil
}



func GetWebSite(id uint64)([]*simplejson.Json,error){
	// websites和user用于接收从数据库直接获得的数据
	websites := []model.Website{}
	// group_web为最新要返回的json数组
	group_web := []*simplejson.Json{}
	// mySet用于制作网站分组的集合,并指明该分组位于group_web的第几个元素
	mySet := make(map[string]int)
	// index则是计数,每遇到新的分组就会将当前值赋给mySet[当前组]并加1
	index := new(int)
	// 首先初始化为0
	*index = 0
	// 根据用户将他的网站分组信息取出
	if err := config.Db.Where("user_id = ?", id).Find(&websites).Error;err != nil{
		return nil,err
	}
	// 遍历其分组信息
	for _,website := range(websites){
		// 首先判断该分组是否已经存在于group_web中
		exist := SortWebGroup(mySet,website.Web_group,index)
		if exist{
			// 如果已经存在,将其名称,链接,以及icon链接取出
			names := group_web[mySet[website.Web_group]].GetPath("value","name").MustArray()
			urls := group_web[mySet[website.Web_group]].GetPath("value","url").MustArray()
			icons := group_web[mySet[website.Web_group]].GetPath("value","icon").MustArray()
			// 添加新的元素
			names = append(names, website.Name)
			urls = append(urls, website.Url)
			icons = append(icons, website.Icon)
			// 重新赋值
			group_web[mySet[website.Web_group]].SetPath([]string{"value","name"},names)
			group_web[mySet[website.Web_group]].SetPath([]string{"value","url"},urls)
			group_web[mySet[website.Web_group]].SetPath([]string{"value","icon"},icons)
		}else{
			// 先写成字典,在变成byte,最后变成json对象
			group_web_map := map[string]map[string][]string{"value":{"name":[]string{website.Name},"icon":[]string{website.Icon},"url":[]string{website.Url}}}
			group_web_byte,_ := json.Marshal(group_web_map)
			group_web_json,_ := simplejson.NewJson(group_web_byte)
			group_web_json.Set("label",website.Web_group)
			group_web = append(group_web, group_web_json)
		}
	}
	return group_web,nil
}
