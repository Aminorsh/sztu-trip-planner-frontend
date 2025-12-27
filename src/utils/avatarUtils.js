/**
 * 头像URL处理工具函数
 * 统一处理头像URL的生成，确保所有页面保持一致
 */

/**
 * 获取完整的头像URL
 * @param {string} avatarPath - 头像路径
 * @returns {string} 完整的头像URL
 */
export const getFullAvatarUrl = (avatarPath) => {
  if (!avatarPath) return ''
  
  // 如果是完整URL，直接返回
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  
  // 如果是 /static/ 开头的路径，直接使用服务器地址 + 路径（不要api前缀）
  if (avatarPath.startsWith('/static/')) {
    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080'
    return `${serverUrl}${avatarPath}`
  }
  
  // 其他情况，视为相对路径处理
  const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080'
  return `${serverUrl}/static/avatars/${avatarPath}`
}

/**
 * 触发头像更新事件
 * 通知其他页面刷新头像显示
 * @param {string} avatarUrl - 新的头像URL
 */
export const triggerAvatarUpdate = (avatarUrl) => {
  // 触发自定义事件
  window.dispatchEvent(new CustomEvent('avatar-updated', { 
    detail: { avatarUrl } 
  }))
  
  // 使用localStorage事件，确保跨标签页也能监听到
  localStorage.setItem('avatar-updated', Date.now().toString())
  localStorage.removeItem('avatar-updated')
  
  console.log('头像更新事件已触发:', avatarUrl)
}