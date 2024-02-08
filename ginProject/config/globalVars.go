package config

import (
	"fmt"
	"os"
	"path/filepath"
)

var global_map = make(map[string]interface{})

func InitGlobal() {
	// 获取项目路径
	executable_path, _ := os.Executable()
	base_dir := filepath.Dir(executable_path)
	fmt.Println(base_dir)
	// base_dir := "E:/Myproject/ginProject"
	global_map["project_dir"] = base_dir
}
func GetGlobalValue(key string) interface{} {
	return global_map[key]
}