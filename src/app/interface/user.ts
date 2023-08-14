export interface User {
    id: number;
    role: string;
    username: string;
    password: string;
    name: string;
    email: string;
    token: string;
    createdAt: Date;
}

export interface UserBasic {
    id: number;
    role: string;
    username: string;
    name: string;
    email: string;
    createdAt: Date;
}
// type User struct {
// 	ID        uint      `json:"id" gorm:"primaryKey"`
// 	Role      string    `json:"role" gorm:"type:varchar(255) NOT NULL DEFAULT 'user'"`
// 	Username  string    `json:"username" gorm:"unique; type:varchar(100); not null" binding:"required"`
// 	Password  string    `json:"password" gorm:"not null" binding:"required"`
// 	Name      string    `json:"name,omitempty" gorm:"type:varchar(255)"`
// 	Email     string    `json:"email,omitempty" gorm:"type:varchar(255)"`
// 	Token     string    `json:"token" gorm:"not null"`
// 	CreatedAt time.Time `json:"createdAt" gorm:"type:DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"`
// }

// type UserBasic struct {
// 	ID        uint      `json:"id"`
// 	Role      string    `json:"role,omitempty"`
// 	Username  string    `json:"username"`
// 	Name      string    `json:"name,omitempty"`
// 	Email     string    `json:"email,omitempty"`
// 	CreatedAt time.Time `json:"createdAt"`
// }
