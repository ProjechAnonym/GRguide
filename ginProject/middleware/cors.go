package middleware

import (
	"ginproject/config"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/spf13/viper"
)
func Cors() cors.Config{
	viper.SetConfigName("config")
	viper.AddConfigPath(filepath.Join(config.GetGlobalValue("project_dir").(string),"/config"))
	viper.SetConfigType("yaml")
	viper.ReadInConfig()
	cores_config := cors.Config{
		AllowOrigins:     []string{viper.GetString("Cors.origin")},
		AllowMethods:     []string{"PUT", "PATCH","POST","GET"},
		AllowHeaders:     []string{"Origin","domain","scheme","Authorization"},
		ExposeHeaders:    []string{"Content-Length","Content-Type"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}
	return cores_config
}