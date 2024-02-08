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

func SubmmitLink(id uint64,  name string, url string, icon string) (bool, error) {
	// 获取用户信息,取用户名用于索引
	user := model.Users{ID: id}
	if err := config.Db.Take(&user).Error; err != nil {
		return false, err
	}
	// 将要提交的快捷链接变成结构体由gorm上传
	link := model.Link{Username: user.Username, Name: name, Url: url, Icon: icon,UserID: id}
	if err := config.Db.Create(&link).Error; err != nil {
		return false, err
	}

	return true, nil
}

func DeleteLink(id uint64,  name string) (bool, error) {
	var link model.Link
	group_name := "link"
	link_name := url.QueryEscape(name)
	viper.SetConfigName("config")
	viper.AddConfigPath(filepath.Join(config.GetGlobalValue("project_dir").(string),"/config"))
	viper.SetConfigType("yaml")
	viper.ReadInConfig()
	base_url := viper.Get("Api.host")
	if err1 := config.Db.Where("user_id = ? AND name = ?", id,  name).First(&link).Error; err1 != nil {
		return false, err1
	}
	
	if regexp.MustCompile(fmt.Sprintf("%s/getpic/userid%d/%s/%s",base_url,id,group_name,link_name)).MatchString(link.Icon){
		file_path := strings.Split(link.Icon, "/")
		special_char,err4 := url.QueryUnescape(file_path[len(file_path)-1])
		if err4!=nil{
			zap.L().Error("字符编码失败",zap.Error(err4))
		}
		if err3 := os.Remove(fmt.Sprintf("%s/static/%s/%s/%s",config.GetGlobalValue("project_dir"),file_path[len(file_path)-3],file_path[len(file_path)-2],special_char));err3 != nil{
			zap.L().Error("删除图片失败",zap.Error(err3))
			return false,err3
		}
	}
	// 删除该用户指定的快捷链接
	if err := config.Db.Where("user_id = ? AND name = ?", id,  name).Delete(&model.Link{}).Error; err != nil {
		return false, err
	}
	return true, nil
}

func GetLinks(id uint64) ([]*simplejson.Json,error){
	links := []model.Link{}
	// 获取该用户的快捷链接信息
	if err := config.Db.Select("url","icon","name").Where("user_id = ?", id).Find(&links).Error; err != nil {
		return nil, err
	}
	// 返回一些默认的网站
	bilibili := model.Link{Icon:"https://th.bing.com/th?id=ODLS.e42d2c4d-ad65-4c7a-b0fd-817a1c3bed01&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2",Name:"bilibili",Url:"https://www.bilibili.com"}
	youtube := model.Link{Icon:"https://th.bing.com/th?id=ODLS.c0f780d9-19dc-4880-9137-f40a77ad8077&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2",Name:"youtube",Url:"https://www.youtube.com"}
	github := model.Link{Icon:"https://th.bing.com/th?id=ODLS.05409d17-5d83-4701-acc1-90430dd3b02c&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2",Name:"github",Url:"https://github.com/"}
	links = append(links,bilibili,youtube,github)
	// 整理为json格式
	links_json := formatLinks(links)
	return links_json,nil
}

func formatLinks(links []model.Link)[]*simplejson.Json{
	// 将获取到的链接转为json格式返回
	content := make([]*simplejson.Json,len(links))
	for index,link :=  range(links){
		// 先变成字典
		link_property := map[string]string{"icon":link.Icon,"url":link.Url,"name":link.Name}
		// 由字典转为byte
		link_property_byte,_ := json.Marshal(link_property)
		// 最后由simplejson库转为json结构体
		content[index],_ =  simplejson.NewJson(link_property_byte)		
	}
	return content
}