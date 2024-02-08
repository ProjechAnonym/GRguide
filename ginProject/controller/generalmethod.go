package controller

import (
	"errors"
	"fmt"
	"ginproject/config"
	"path/filepath"
	"regexp"
)

func SortWebGroup(group map[string]int, key string, index *int) bool {
	if _, ok := group[key]; ok {
		return true
	} else {
		group[key] = *index
		*index += 1
		return false
	}
}

func ChangeFileName(file_name string,web_name string,group string,id uint64) (string,error) {
	// 允许的文件后缀
	types := []string{"jpg","jpeg","png","svg","ico"}
	// 创建正则匹配元素
	reg := regexp.MustCompile(`\.`)
	file_slice := reg.Split(file_name,-1)
	// 获取文件类型
	file_type := file_slice[len(file_slice)-1]
	
	// 遍历允许类型查看是否允许类型
	for index,allow_type := range(types){
		
		if file_type == allow_type{
			break
		}else if(index == len(types)-1){
			return "不允许",errors.New("不是允许的格式")
		}
	}
	// 更新新的文件名
	new_file := web_name + "." + file_type
	file_path := filepath.Join(config.GetGlobalValue("project_dir").(string),fmt.Sprintf("/static/userid%d/%s/%s",id,group,new_file))
	return file_path,nil
}