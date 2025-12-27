# 头像上传接口测试指南

## 后端接口信息
- **URL**: `POST http://localhost:8080/api/v2/users/upload-avatar`
- **Content-Type**: `multipart/form-data`
- **认证**: Bearer Token

## 测试方法

### 1. 使用HTML测试页面
打开 `test-upload.html` 文件，可以直接测试上传功能。

### 2. 使用curl命令

```bash
# 首先需要获取token（通过登录）
TOKEN="your_jwt_token_here"

# 上传头像文件
curl -X POST \
  http://localhost:8080/api/v2/users/upload-avatar \
  -H "Authorization: Bearer $TOKEN" \
  -F "avatar=@/path/to/your/image.jpg"
```

### 3. 使用Postman
1. 创建新请求
2. 方法：POST
3. URL：`http://localhost:8080/api/v2/users/upload-avatar`
4. Headers：
   - Authorization: Bearer {your_token}
5. Body：
   - form-data
   - Key: avatar, Type: File, 选择图片文件

## 预期响应

### 成功响应 (200 OK)
```json
{
  "success": true,
  "data": {
    "avatar_url": "/static/avatars/user_1_1640995200.jpg"
  }
}
```

### 错误响应示例

#### 文件类型错误 (400 Bad Request)
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "avatar: Invalid file type"
  }
}
```

#### 认证错误 (401 Unauthorized)
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized"
  }
}
```

#### 文件过大错误 (400 Bad Request)
```json
{
  "error": {
    "code": "INVALID_REQUEST", 
    "message": "avatar: File too large"
  }
}
```

## 前端实现要点

1. **接口调用**：
   ```javascript
   const formData = new FormData()
   formData.append('avatar', file)
   
   const response = await apiClient.post('/v2/users/upload-avatar', formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   })
   ```

2. **响应处理**：
   ```javascript
   // apiClient拦截器返回response.data
   // 所以实际收到的数据结构是：
   {
     success: true,
     data: {
       avatar_url: "/static/avatars/user_1_1640995200.jpg"
     }
   }
   
   // 获取avatar_url
   const avatarUrl = response.data?.avatar_url
   ```

3. **文件验证**：
   ```javascript
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
   const isLt2M = file.size / 1024 / 1024 < 2
   ```

## 调试步骤

1. **检查后端服务**：确保后端服务在 http://localhost:8080 运行
2. **检查网络连接**：确保能访问后端API
3. **检查Token**：确保localStorage中有有效的token
4. **检查文件路径**：确保uploads/avatars目录存在且有写权限
5. **查看后端日志**：检查详细的上传日志

## 常见问题

1. **CORS错误**：检查后端CORS配置
2. **404错误**：确认API路径正确
3. **认证失败**：检查token是否有效
4. **文件保存失败**：检查目录权限和磁盘空间