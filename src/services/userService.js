import apiClient from './apiClient'

// 获取个人信息
export function getProfile() {
  return apiClient.get('/v2/users/profile')
}

// 更新个人信息
export function updateProfile({ display_name, bio }) {
  return apiClient.put('/v2/users/profile', { display_name, bio })
}

// 修改密码
export function changePassword({ old_password, new_password }) {
  return apiClient.put('/v2/users/change-password', { old_password, new_password })
}

// 更新头像（FormData）
export function updateAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  return apiClient.put('/v2/users/update-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
