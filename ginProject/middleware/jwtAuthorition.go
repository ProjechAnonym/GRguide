package middleware

import (
	"net/http"
	"regexp"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// 定义需要编码加密的字段
type JWTClaims struct {
	ID       uint64   `json:"id"`
	UserName string `json:"user_name"`
	jwt.StandardClaims
}

// 定义不需要jwt认证的路由
var skip_paths = []string{"/login","/register","/retrievepassword","/editpassword","/getpic"}

// 编写中间件
func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 遍历不需要认证的路由,遇到直接返回
		for _, skip_path := range skip_paths {
			path := regexp.MustCompile("/").Split(c.Request.URL.String(),-1)[2]
			
			if regexp.MustCompile(path).MatchString(skip_path){
				c.Next()
				return
			}
		}
		
		// 从请求头中获取Authorization
		tokenString := c.Request.Header.Get("Authorization")
		// token为空报错返回
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		// 这里则是解密token获得字段结构体
		token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte("sifulin"), nil // 在这里你应该使用加密的密钥
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		// 字段结构体解密成功之后在上下文中设置用户id和用户名
		if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
			c.Set("id", claims.ID)
			c.Set("user_name", claims.UserName)
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
	}
}