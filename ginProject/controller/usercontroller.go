package controller

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"ginproject/config"
	"ginproject/model"
	"path/filepath"
	"time"

	"github.com/bitly/go-simplejson"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gopkg.in/gomail.v2"
	"gorm.io/gorm"
)

func encrypto(password string)string{
	password_byte := []byte(password)
	md5 := md5.New()
	md5.Write(password_byte)
	return hex.EncodeToString(md5.Sum(nil))
}

func checkUserIsExis(username string) (bool,model.Users){
	// 验证用户是否已经存在
	var user model.Users
	err := config.Db.Where("username = ?",username).First(&user).Error
	return !(err == gorm.ErrRecordNotFound),user
}

func RegisterUser(username string, password string, email string) bool{ 
	// 通过将用户密码转为byte方便后面使用md5加密
	password_crypto := encrypto(password)
	// 用户存在则返回
	if tag,_ := checkUserIsExis(username);tag{
		return false
	}
	// 创建用户结构体并上传数据库
	user := model.Users{Username: username,Password: password_crypto,Email: email}
	config.Db.Create(&user)
	return true
}

func Login(username string, password string) (bool,uint64){
	// 通过将用户密码转为byte方便后面使用md5加密
	password_crypto := encrypto(password)
	// 验证用户是否存在
	if tag,user := checkUserIsExis(username);tag{
		// 比对密码是否正确
		if password_crypto == user.Password{
			return true,user.ID
		}else{
			return false,0
		}
	}
	return false,0
}

func RetrievePassword(username string,host string,scheme string) bool{
	// 定义邮件内容
	message := `
	<div style="text-align: center">
      <img
        src="https://s2.loli.net/2024/02/07/wAJxzkM7KFGulhD.png"
        style="width: 10rem; height: 8rem"
      />
    </div>
    <div><h2>用户%s,您好!</h2></div>
    <div style="text-align: center">
      <p style="font-size: 1.5rem">
        您正在重置导航站的密码,请在两分钟内点击下面链接
      </p>
      <p>
        <a
          href="%s"
          style="
            font-size: 2.3rem;
            font-weight: bolder;
            text-decoration: none;
            color: crimson;
          "
          >重置密码链接</a
        >
      </p>
    </div>
    <div
      style="text-align: center; margin-top: 3rem; margin-bottom: 0; padding: 0"
    >
      <a
        href="https://www.youtube.com/@Linsifu666"
        style="text-decoration: none; margin: 0 0.5rem 0 0.5rem"
        ><img
          style="height: 2rem; width: 2rem"
          src="https://s2.loli.net/2024/01/25/Voa8Qj7ON69Td4n.png"
        />
      </a>
      <a
        href="https://space.bilibili.com/8337954?spm_id_from=333.1007.0.0"
        style="text-decoration: none; margin: 0 0.5rem 0 0.5rem"
        ><img
          style="height: 2rem; width: 2rem"
          src="https://s2.loli.net/2024/02/07/gnYw1WSOTZoX6kp.png"
        />
      </a>
      <a
        href="https://t.me/+5yh2rgXjWBlmMDk1"
        style="text-decoration: none; margin: 0 0.5rem 0 0.5rem"
        ><img
          style="height: 2rem; width: 2rem"
          src="https://s2.loli.net/2024/01/25/V9Y5WIXb7Nhml1w.png"
        />
      </a>
      <a
        href="https://github.com/ProjechAnonym"
        style="text-decoration: none; margin: 0 0.5rem 0 0.5rem"
        ><img
          style="height: 2rem; width: 2rem"
          src="https://s2.loli.net/2024/01/25/5HKJtIzEQYWwF6G.png"
        />
      </a>
      <a
        href="https://blog.sifulin.top"
        style="text-decoration: none; margin: 0 0.5rem 0 0.5rem"
        ><img
          style="height: 2rem; width: 2rem"
          src="https://s2.loli.net/2024/01/25/yRN5vAOrHdbWC9n.png"
        />
      </a>
    </div>
    <div style="text-align: center">
      <p style="font-size: 0.8rem; color: darkgray; margin: 0">
        This project is developed by sifulin
      </p>
      <p style="font-size: 0.8rem; color: darkgray; margin: 0">
        Style is designed by 江南千鹤
      </p>
    </div>`
	
	// 获取smtp邮件服务器配置
	viper.SetConfigName("config")
	viper.AddConfigPath(filepath.Join(config.GetGlobalValue("project_dir").(string),"/config"))
	viper.SetConfigType("yaml")
	viper.ReadInConfig()
	smtp_host := viper.Get("SMTP.host")
	smtp_port := viper.GetInt("SMTP.port")
	smtp_username := viper.Get("SMTP.username")
	smtp_password := viper.Get("SMTP.password")
	d := gomail.NewDialer(
		smtp_host.(string),
		smtp_port,
		smtp_username.(string),
		smtp_password.(string),
	)
	

	// 获取用户信息
	var user model.Users
	if err := config.Db.Where("username = ?",username).First(&user).Error;err!=nil{
		return false
	}
	// 生成token
	secret_key := fmt.Sprintf("linsifu_%s_%d",user.Username,time.Now().Unix())
	token := encrypto(secret_key)
	// 写入redis
	config.Redis.Set(user.Username,token,120*time.Second)
	// 发送给邮箱的链接
	href := fmt.Sprintf(`%s//%s/edit/%d/%s`,scheme,host,user.ID,token)
	email := user.Email
	// 发送邮箱的设置
	m := gomail.NewMessage()
	m.SetHeader("From",smtp_username.(string))
	m.SetHeader("To",email)
	m.SetHeader("Subject", "找回密码")
	m.SetBody("text/html", fmt.Sprintf(message,user.Username,href)) 
	if err := d.DialAndSend(m); err != nil {
		zap.L().Error("发送邮件失败",zap.Error(err))
		return false
	}
	return true
}

func EditPassword(id uint64,token string,password string)bool{
	// 获取密码byte
	password_crypto := encrypto(password)
	// 定义用户模型查找用户信息
	var user model.Users
	if err := config.Db.Where("id = ?",id).First(&user).Error;err != nil{
		zap.L().Error("编辑密码获取用户失败",zap.Error(err))
	}
	// 从redis中获取token
	redis_token,err := config.Redis.Get(user.Username).Result()
	if err != nil{
		zap.L().Error("获取token失败,可能已经过期")
		return false
	}
	// 比较token是否正确
	if redis_token == token{
		config.Db.Model(&user).Update("password",password_crypto)
		return true
	}
	return false
}

func Searchwebsite(id uint64,word string) ([]*simplejson.Json,error){
	
	// 定义网站模型数组用于接收查询结果
	var websites []model.Website
	if err:= config.Db.Where("user_id = ? AND name LIKE ?",id,fmt.Sprintf("%%%s%%",word)).Find(&websites).Error;err!=nil{
		zap.L().Error("查询网站失败",zap.Error(err))
		return nil,err
	}
	// 定义网站的参数数组,用于组成json
	names := make([]string,len(websites))
	icons := make([]string,len(websites))
	urls := make([]string,len(websites))
	// 给数组赋值
	for index,website := range(websites){
		names[index] = website.Name
		icons[index] = website.Icon
		urls[index] = website.Url
	}
	// 将结果变成json对象
	result := map[string]map[string][]string{"value":{"name":names,"icon":icons,"url":urls}}
	result_byte,_ := json.Marshal(result)
	result_json,_ := simplejson.NewJson(result_byte)
	result_json.Set("label","搜索结果")
	json_squence := []*simplejson.Json{result_json}
	
	return json_squence,nil
}