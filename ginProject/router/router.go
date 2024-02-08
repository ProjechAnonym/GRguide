package router

import (
	"ginproject/config"
	"ginproject/controller"
	"ginproject/middleware"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Router() *gin.Engine{
	r := gin.Default()
	// 注册zap以及jwt相关中间件
	r.Use(cors.New(middleware.Cors()))
	r.Use(middleware.GinLogger(), middleware.GinRecovery(true), middleware.JWTAuthMiddleware())
	
	
	// 注册功能
	r.POST("/api/register", func(c *gin.Context) {
		// 从表单获取数据
		username := c.PostForm("username")
		password := c.PostForm("password")
		email := c.PostForm("email")
		if controller.RegisterUser(username, password, email) {
			c.JSON(http.StatusOK, gin.H{"status": true, "message": "注册成功"})
		} else {
			c.JSON(http.StatusServiceUnavailable, gin.H{"status": false, "message": "注册失败"})
		}
	})
	// 登录功能
	r.POST("/api/login", func(c *gin.Context) {
		// 从表单获取数据
		password := c.PostForm("password")
		userName := c.PostForm("username")
		// if语句后面验证账户密码是否匹配
		if status, id := controller.Login(userName, password); status {
			// 如果匹配则生成jwt,第一个参数是加密方法,第二个是加密的结构体内容,是jwt对象
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, middleware.JWTClaims{
				ID:       id,
				UserName: userName,
				StandardClaims: jwt.StandardClaims{
					ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
				},
			})
			// 最后由密钥加密成jwt的token
			tokenString, err := token.SignedString([]byte("sifulin"))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"错误": "生成token失败"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"token": tokenString,"id":id})			
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"token":"", "id":0})
		}
	})
	r.POST("/api/retrievepassword",func(c *gin.Context) {
		username := c.PostForm("username")
		host := c.GetHeader("domain")
		scheme := c.GetHeader("scheme")
		if controller.RetrievePassword(username,host,scheme){
			c.JSON(http.StatusOK,gin.H{"发送成功":"查看邮箱"})
			return
		}else{
			c.JSON(http.StatusServiceUnavailable,gin.H{"发送失败":"联系管理员"})
			return
		}
	})

	r.POST("/api/editpassword/:id/:token",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		token := c.Param("token")
		password := c.PostForm("password")
		if controller.EditPassword(id,token,password){
			c.JSON(http.StatusOK,gin.H{"成功":"修改密码成功"})
		}else{
			c.JSON(http.StatusServiceUnavailable,gin.H{"失败":"修改密码失败"})
		}
		
	})
	// 创建用户路由组
	user_group := r.Group("/api/user")
	user_group.GET("/valid/:id/:token",func(c *gin.Context) {
		c.JSON(http.StatusOK,gin.H{"成功":"提交快捷链接成功"})
	})
	// 提交快捷链接
	user_group.POST("/:id/summitlink",func(c *gin.Context) {
		// 获取表单数据
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		name := c.PostForm("name")
		url := c.PostForm("url")
		icon := c.PostForm("icon")
		// 提交到数据库
		if _,err := controller.SubmmitLink(id,name,url,icon);err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"提交快捷链接失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"成功":"提交快捷链接成功"})
	})
	// 提交网站
	user_group.POST("/:id/summitweb",func(c *gin.Context) {
		// 获取表单数据
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		group := c.PostForm("group")
		name := c.PostForm("name")
		url := c.PostForm("url")
		icon := c.PostForm("icon")
		if _,err := controller.SubmmitWeb(id,group,name,url,icon);err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"提交网页失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"成功":"提交网页成功"})
	})
	// 添加网站的图片链接
	user_group.POST("/:id/summitpic",func(c *gin.Context) {
		// 获取表单数据
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		group := c.PostForm("group")
		if group == ""{
			group = "link"
		}else if group == "link"{
			group = "userlinkgroup"
		}
		name := c.PostForm("name")
		file,_ := c.FormFile("file")
		dst,err := controller.ChangeFileName(file.Filename,name,group,id)
		
		if err!=nil{
			zap.L().Error("提交图片错误",zap.Error(err))
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"提交图片失败"})
			return
		}
		c.SaveUploadedFile(file, dst)
		c.JSON(http.StatusOK,gin.H{"成功":"提交图片成功"})
	})

	// 删除网站
	user_group.POST("/:id/deleteweb",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		group := c.PostForm("group")
		name := c.PostForm("name")
		if _,err := controller.DeleteWeb(id,group,name);err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"删除网页失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"成功":"删除网页成功"})
	})
	// 删除网站组
	user_group.POST("/:id/deletewebgroup",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		group := c.PostForm("group")
		if _,err := controller.DeleteWebGroup(id,group);err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"删除组失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"成功":"删除组成功"})
	})
	// 删除快捷链接
	user_group.POST("/:id/deletelink",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		name := c.PostForm("name")
		if _,err := controller.DeleteLink(id,name);err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"删除失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"成功":"删除成功"})
	})
	// 获取快捷链接
	user_group.GET("/:id/getlink",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		links,err := controller.GetLinks(id)
		if err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"提交失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"link":links})
	})
	// 获取网站组信息
	user_group.GET("/:id/getwebsite",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		websites,err := controller.GetWebSite(id)
		if err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"提交失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"websites":websites})
	})

	user_group.POST("/:id/search",func(c *gin.Context) {
		id,_ := strconv.ParseUint(c.Param("id"),10,64)
		word := c.PostForm("word")
		websites,err := controller.Searchwebsite(id,word)
		if err != nil{
			c.JSON(http.StatusInternalServerError,gin.H{"错误":"提交失败"})
			return
		}
		c.JSON(http.StatusOK,gin.H{"websites":websites})
	})

	
	// 获取图片链接
	
	r.StaticFS("/api/getpic",http.Dir(filepath.Join(config.GetGlobalValue("project_dir").(string),"/static")))
	
	return r
}