package model

type Users struct {
	ID       uint64 `gorm:"primaryKey" json:"id"`
	Username string `json:"username" gorm:"not null;unique;type:varchar(20)"`
	Password string `json:"password" gorm:"not null;type:varchar(50)"`
	Email    string `gorm:"not null;type:varchar(30)" json:"email"`
}

type Link struct {
	ID       uint64 `gorm:"primaryKey" json:"id"`
	Username string `json:"username" gorm:"not null;type:varchar(20)"`
	Url      string `json:"url" gorm:"not null;type:varchar(255)"`
	Icon     string `json:"icon" gorm:"not null;type:varchar(255)"`
	Name     string `json:"name" gorm:"not null;type:varchar(20)"`
	UserID   uint64 `json:"userid" gorm:"not null"`
}

type Website struct {
	ID        uint64 `gorm:"primaryKey" json:"id"`
	Username  string `json:"username" gorm:"not null;type:varchar(20)"`
	Web_group string `json:"web_group" gorm:"not null;type:varchar(20)"`
	Url       string `json:"url" gorm:"not null;type:varchar(255)"`
	Name      string `json:"name" gorm:"not null;type:varchar(20)"`
	Icon      string `json:"icon" gorm:"not null;type:varchar(255)"`
	UserID    uint64 `json:"userid" gorm:"not null"`
}