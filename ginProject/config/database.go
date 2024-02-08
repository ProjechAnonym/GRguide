package config

import (
	"ginproject/model"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"github.com/go-redis/redis"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/gorm"
)
var Db *gorm.DB
var Redis *redis.Client
func GetDb() {
	var err error
	viper.SetConfigName("config")
	viper.AddConfigPath(filepath.Join(GetGlobalValue("project_dir").(string),"/config"))
	viper.SetConfigType("yaml")
	viper.ReadInConfig()
	// connect_string := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",viper.Get("MariaDb.user"),viper.Get("MariaDb.password"),viper.Get("MariaDb.addr"),viper.Get("MariaDb.port"),viper.Get("MariaDb.database"))
	Db,err = gorm.Open(sqlite.Open("webNav.db"),&gorm.Config{})
	if err != nil{
		zap.L().Error("连接数据库失败",zap.Error(err))
	}
	Db.AutoMigrate(&model.Users{},&model.Website{},&model.Link{})
}

func GetRedis(){
	viper.SetConfigName("config")
	viper.AddConfigPath(filepath.Join(GetGlobalValue("project_dir").(string),"/config"))
	viper.SetConfigType("yaml")
	viper.ReadInConfig()
	Redis = redis.NewClient(&redis.Options{
		Addr:     viper.GetString("Redis.addr"),
		Password: "", // no password set
		DB:       0,  // use default DB
	})

}