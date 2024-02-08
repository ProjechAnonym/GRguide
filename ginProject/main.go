package main

import (
	"ginproject/config"
	"ginproject/router"

	"github.com/gin-gonic/gin"
)
func init(){
	config.InitGlobal()
	config.GetCore()
	config.GetDb()
	config.GetRedis()
}
func main() {
	gin.SetMode(gin.ReleaseMode)
	r := router.Router()
	r.Run(":8082")
}